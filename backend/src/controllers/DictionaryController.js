import DictionaryModel from '../models/dictionary.js';
import DictionaryWordModel from '../models/dictionaryWord.js';

export const getDictionaries = async (req, res) => {
    try {
        const dictionaries = await DictionaryModel.find({});
        const dictionaryWords = await DictionaryWordModel.find({});

        const mapped = dictionaries.map((dictionary) => {
            const wordsCount = dictionaryWords.filter((w) =>
                w.dictionaryId.equals(dictionary._id)
            ).length;

            return {
                id: dictionary._id,
                title: dictionary.title,
                wordsCount
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

