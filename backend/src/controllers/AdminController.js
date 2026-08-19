import UserModel from "../models/user.js";
import WordModel from "../models/word.js";
import DictionaryModel from "../models/dictionary.js";
import DictionaryWordModel from "../models/dictionaryWord.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { wordResponseMapper } from '../utils.js';

export const login = async  (req, res) => {
    try {
        const { login, password } = req.body;

        if (login !== process.env['ADMIN_ROOT'] || password !== process.env['ADMIN_PASSWORD']) {
            console.log('WRONG')
            return res.status(400).json({
                message: 'Wrong login or password'
            });
        }

        const token = jwt.sign(
            {
                login: login
            },
            process.env['SECRET_KEY'],
            {
                expiresIn: process.env['TOKEN_EXPIRES']
            }
        );

        res.json({ token });
    } catch (err) {
        res.status(500).json({
            message: 'Login error'
        });
    }
}

export const createNewUser = async (req, res) => {
    try {
        const {
            login,
            name,
            password
        } = req.body;

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            login,
            name,
            passwordHash
        });

        const user = await doc.save();

        const newUser = {
            id: user._doc._id,
            name: user._doc.name,
            login: user._doc.login,
            lastTestDate: user._doc.lastTestDate,
            allowedTests: user._doc.allowedTests,
            createdAt: user._doc.createdAt,
            words: 0
        };

        res.json(newUser);
    } catch (err) {
        res.status(500).json({
            message: 'Registration error'
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({});
        const words = await WordModel.find({});

        const mappedUsers = users.map(user => {
            const usersWords = words.filter(word => word.userId.equals(user._id));

            return {
                id: user._id,
                login: user.login,
                name: user.name,
                lastTestDate: user.lastTestDate,
                createdAt: user.createdAt,
                wordsCount: usersWords.length
            };
        });

        res.json(mappedUsers);
    } catch (err) {
        res.status(500).json({
            message: 'Cant get users'
        });
    }
}

export const updateUser = async (req, res) => {
    try {
        const user = await UserModel.findByIdAndUpdate(
            {
                _id: req.body.id
            },
            {
                name: req.body.name,
                login: req.body.login
            },
            {
                new: true
            }
        );

        const mappedUserData = {
            login: user.login,
            name: user.name,
        };

        res.json(mappedUserData);
    } catch (err) {
        res.status(500).json({
            message: 'Cant update user'
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        await WordModel.deleteMany({
            userId: id
        });

        await UserModel.findOneAndDelete({
            _id: id
        });

        res.json({
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: 'Cant delete user'
        });
    }
}

export const getAllWords = async (req, res) => {
    try {
        const words = await WordModel.find({});
        const users = await UserModel.find({});

        const mappedWords = words.map(word => {
            const wordOwner = users.find(user => user._id.equals(word.userId));

            return {
                ...wordResponseMapper(word),
                ownerLogin: wordOwner.login
            }
        });

        res.json(mappedWords);
    } catch (err) {
        res.json({
            message: 'Cant fetch words'
        })
    }
}

export const deleteWord = async (req, res) => {
    try {
        const { id } = req.params;

        await WordModel.findOneAndDelete({
            _id: id
        });

        res.json({
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: 'Cant delete word'
        });
    }
}

export const getAllDictionaries = async (req, res) => {
    try {
        const dictionaries = await DictionaryModel.find({});
        const dictionaryWords = await DictionaryWordModel.find({});

        const mappedDictionaries = dictionaries.map(dictionary => {
            const wordsCount = dictionaryWords.filter(word => word.dictionaryId.equals(dictionary._id)).length;

            return {
                id: dictionary._id,
                title: dictionary.title,
                createdAt: dictionary.createdAt,
                wordsCount
            };
        });

        res.json(mappedDictionaries);
    } catch (err) {
        res.status(500).json({
            message: 'Cant get dictionaries'
        });
    }
};

export const createDictionary = async (req, res) => {
    try {
        const { title } = req.body;

        const dictionary = await DictionaryModel.create({
            title
        });

        res.json({
            id: dictionary._id,
            title: dictionary.title,
            createdAt: dictionary.createdAt,
            wordsCount: 0
        });
    } catch (err) {
        res.status(500).json({
            message: 'Cant create dictionary'
        });
    }
};

export const updateDictionary = async (req, res) => {
    try {
        const dictionary = await DictionaryModel.findByIdAndUpdate(
            req.body.id,
            {
                title: req.body.title
            },
            {
                new: true
            }
        );

        if (!dictionary) {
            return res.status(404).json({
                message: 'Dictionary not found'
            });
        }

        res.json({
            id: dictionary._id,
            title: dictionary.title
        });
    } catch (err) {
        res.status(500).json({
            message: 'Cant update dictionary'
        });
    }
};

export const deleteDictionary = async (req, res) => {
    try {
        const { id } = req.params;

        await DictionaryWordModel.deleteMany({
            dictionaryId: id
        });

        await DictionaryModel.findOneAndDelete({
            _id: id
        });

        res.json({
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: 'Cant delete dictionary'
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

        const words = await DictionaryWordModel.find({
            dictionaryId: id
        });

        res.json({
            dictionary: {
                id: dictionary._id,
                title: dictionary.title,
                createdAt: dictionary.createdAt
            },
            words: words.map(word => ({
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

export const createDictionaryWord = async (req, res) => {
    try {
        const { id } = req.params;
        const { word, translate } = req.body;

        const dictionary = await DictionaryModel.findById(id);

        if (!dictionary) {
            return res.status(404).json({
                message: 'Dictionary not found'
            });
        }

        const dictionaryWord = await DictionaryWordModel.create({
            dictionaryId: id,
            word,
            translate
        });

        res.json({
            id: dictionaryWord._id,
            word: dictionaryWord.word,
            translate: dictionaryWord.translate,
            dictionaryId: dictionaryWord.dictionaryId,
            createdAt: dictionaryWord.createdAt
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                message: 'Word already exists in this dictionary'
            });
        }

        res.status(500).json({
            message: 'Cant create dictionary word'
        });
    }
};

export const updateDictionaryWord = async (req, res) => {
    try {
        const dictionaryWord = await DictionaryWordModel.findByIdAndUpdate(
            req.body.id,
            {
                word: req.body.word,
                translate: req.body.translate
            },
            {
                new: true
            }
        );

        if (!dictionaryWord) {
            return res.status(404).json({
                message: 'Word not found'
            });
        }

        res.json({
            id: dictionaryWord._id,
            word: dictionaryWord.word,
            translate: dictionaryWord.translate
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                message: 'Word already exists in this dictionary'
            });
        }

        res.status(500).json({
            message: 'Cant update dictionary word'
        });
    }
};

export const deleteDictionaryWord = async (req, res) => {
    try {
        const { id } = req.params;

        await DictionaryWordModel.findOneAndDelete({
            _id: id
        });

        res.json({
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: 'Cant delete dictionary word'
        });
    }
}
