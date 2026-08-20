import DictionaryModel from '../models/dictionary.js';
import DictionaryWordModel from '../models/dictionaryWord.js';
import UserDictionaryModel from '../models/userDictionary.js';
import {
    defaultDictionaryProgress,
    userDictionaryProgressMapper,
    userDictionaryResponseMapper
} from '../utils.js';

const assertUserAccess = (req, res, userId) => {
    if (String(req.userId) !== String(userId)) {
        res.status(403).json({
            message: 'Forbidden'
        });
        return false;
    }

    return true;
};

const calculateBestProgress = (correctCount, totalCount) => {
    const bestProgressPercent = Math.round((correctCount / totalCount) * 100);

    return {
        bestCorrectCount: correctCount,
        bestProgressPercent: Math.min(bestProgressPercent, 100)
    };
};

export const getDictionaries = async (req, res) => {
    try {
        const dictionaries = await DictionaryModel.find({});
        const dictionaryWords = await DictionaryWordModel.find({});
        const userProgressList = await UserDictionaryModel.find({
            userId: req.userId
        });

        const mapped = dictionaries.map((dictionary) => {
            const wordsCount = dictionaryWords.filter((w) =>
                w.dictionaryId.equals(dictionary._id)
            ).length;

            const userProgress = userProgressList.find((item) =>
                item.dictionaryId.equals(dictionary._id)
            );

            return {
                id: dictionary._id,
                title: dictionary.title,
                wordsCount,
                progress: userProgress
                    ? userDictionaryProgressMapper(userProgress)
                    : defaultDictionaryProgress()
            };
        });

        res.json(mapped);
    } catch (err) {
        res.status(500).json({
            message: 'Cant get dictionaries'
        });
    }
};

export const getDictionaryWords = async (req, res) => {
    try {
        const { id } = req.params;

        const dictionary = await DictionaryModel.findById(id);
        if (!dictionary) {
            return res.status(404).json({
                message: 'Dictionary not found'
            });
        }

        const words = await DictionaryWordModel.find({ dictionaryId: id });

        res.json({
            dictionary: {
                id: dictionary._id,
                title: dictionary.title,
                createdAt: dictionary.createdAt
            },
            words: words.map((word) => ({
                id: word._id,
                word: word.word,
                translate: word.translate,
                dictionaryId: word.dictionaryId,
                createdAt: word.createdAt
            }))
        });
    } catch (err) {
        res.status(500).json({
            message: 'Cant get dictionary words'
        });
    }
};

export const getDictionaryProgress = async (req, res) => {
    try {
        const { userId, dictionaryId } = req.params;

        if (!assertUserAccess(req, res, userId)) {
            return;
        }

        const dictionary = await DictionaryModel.findById(dictionaryId);
        if (!dictionary) {
            return res.status(404).json({
                message: 'Dictionary not found'
            });
        }

        const userProgress = await UserDictionaryModel.findOne({
            userId,
            dictionaryId
        });

        if (!userProgress) {
            const dictionaryWordsCount = await DictionaryWordModel.countDocuments({
                dictionaryId
            });

            return res.json({
                userId,
                dictionaryId,
                dictionaryTitle: dictionary.title,
                totalCount: dictionaryWordsCount,
                ...defaultDictionaryProgress()
            });
        }

        res.json(userDictionaryResponseMapper(userProgress, dictionary.title));
    } catch (err) {
        res.status(500).json({
            message: 'Cant get dictionary progress'
        });
    }
};

export const saveDictionaryProgress = async (req, res) => {
    try {
        const { userId, dictionaryId } = req.params;
        const { correctCount, totalCount } = req.body;

        if (!assertUserAccess(req, res, userId)) {
            return;
        }

        if (
            typeof correctCount !== 'number' ||
            typeof totalCount !== 'number' ||
            totalCount <= 0 ||
            correctCount < 0 ||
            correctCount > totalCount
        ) {
            return res.status(400).json({
                message: 'Invalid progress data'
            });
        }

        const dictionary = await DictionaryModel.findById(dictionaryId);
        if (!dictionary) {
            return res.status(404).json({
                message: 'Dictionary not found'
            });
        }

        const existingProgress = await UserDictionaryModel.findOne({
            userId,
            dictionaryId
        });

        const bestCorrectCount = Math.max(
            existingProgress?.bestCorrectCount ?? 0,
            correctCount
        );
        const bestProgress = calculateBestProgress(bestCorrectCount, totalCount);
        const lastTestDate = new Date();

        const userProgress = await UserDictionaryModel.findOneAndUpdate(
            {
                userId,
                dictionaryId
            },
            {
                userId,
                dictionaryId,
                totalCount,
                bestCorrectCount: bestProgress.bestCorrectCount,
                bestProgressPercent: bestProgress.bestProgressPercent,
                lastCorrectCount: correctCount,
                lastTestDate
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
            }
        );

        res.json(userDictionaryResponseMapper(userProgress, dictionary.title));
    } catch (err) {
        res.status(500).json({
            message: 'Cant save dictionary progress'
        });
    }
};
