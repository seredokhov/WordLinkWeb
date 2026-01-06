import WordModel from '../models/word.js';
import { wordResponseMapper } from '../utils.js';

export const createWord = async (req, res) => {
    try {
        const doc = new WordModel({
            userId: req.userId,
            ...req.body
        });

        const word = await doc.save();

        res.json(wordResponseMapper(word));
    } catch (err) {
        res.status(500).json({
            message: 'Cant create word'
        });
    }
};

export const updateWord = async (req, res) => {
    try {
        const word =  await WordModel.findOneAndUpdate(
            {
                _id: req.body.id,
                userId: req.userId
            },
            {
                id: req.body._id,
                word: req.body.word,
                translate: req.body.translate,
                progress: req.body.progress,
                isFavorite: req.body.isFavorite,
                isLearned: req.body.isLearned,
                lastUpdate: req.body.lastUpdate
            },
            {
                new: true
            }
        );

        res.json(wordResponseMapper(word));
    } catch (err) {
        res.status(500).json({
            message: 'Cant update word'
        });
    }
}

export const mergeWords = async (req, res) => {
    try {
        const {
            wordsToCreate,
            wordsToUpdate
        } = req.body;

        const mappedWordsToCreate = wordsToCreate.map((word) => ({
            userId: req.userId,
            ...word
        }));

        const createdItems = await WordModel.insertMany(mappedWordsToCreate);
        const createdResults = createdItems.map(wordResponseMapper);

        const updatedResults = [];

        for (const word of wordsToUpdate) {
            const filter = { _id: word.id, userId: req.userId };
            const update = {
                userId: req.userId,
                word: word.word,
                translate: word.translate,
                progress: word.progress,
                isFavorite: word.isFavorite,
                isLearned: word.isLearned,
                lastUpdate: word.lastUpdate
            };

            const oldItem =  await WordModel.findOne(filter);
            const updatedItem = await WordModel.findOneAndUpdate(filter, update, { new: true });

            const updatedResult = {
                oldWordName: oldItem.word,
                newWordData: wordResponseMapper(updatedItem)
            };

            updatedResults.push(updatedResult);
        }

        return res.json({
            created: createdResults,
            updated: updatedResults
        });
    } catch (err) {
        res.status(500).json({
            message: 'Synchronize error'
        });
    }
}

export const deleteWord = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedWord =  await WordModel.findOneAndDelete({
            userId: req.userId,
            _id: id
        });

        if (!deletedWord) {
            return res.status(404).json({
                message: 'Word not found'
            });
        }

        res.json({
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: 'Cant delete word'
        });
    }
}

export const saveResults = async (req, res) => {
    try {
        const words = Object.keys(req.body);
        const entities = Object.values(req.body);

        await WordModel.updateMany(
            {
                userId: req.userId,
                word: { $in: words },
                progress: { $lt: 3 }
            },
            { $inc: { progress: 1 } },
            { new: true }
        );
        await WordModel.updateMany(
            {
                progress: 3,
                isLearned: { $eq: false }
            },
            { isLearned: true }
        );

        const lastDateUpdates = entities.map(entity => {
            return WordModel.updateOne(
                {
                    word: entity.word
                },
                { lastUpdate: entity.lastUpdate }
            );
        });

        await Promise.all(lastDateUpdates);
    } catch (err) {
        res.status(500).json({
            message: 'Cant save results'
        });
    }
}

export const getWords = async (req, res) => {
    try {
        const words = await WordModel.find({ userId: req.userId });

        const dictionary = {};

        words.forEach(el => {
            dictionary[el.word] = wordResponseMapper(el);
        });

        res.json(dictionary);
    } catch (err) {
        res.status(500).json({
            message: 'Cant get words'
        });
    }
}
