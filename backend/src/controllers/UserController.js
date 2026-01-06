import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";
import WordModel from "../models/word.js";
import config from "../../config.js";

export const createUser = async (req, res) => {
    try {
        const {
            login,
            name,
            password,
            isDataSynchronized
        } = req.body;

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            login,
            name,
            passwordHash,
            isDataSynchronized
        });

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id
            },
            config.secred_key,
            {}
        );

        const {
            passwordHash: hash,
            ...userData
        } = user._doc;

        res.json({
            ...userData,
            token
        });
    } catch (err) {
        res.status(500).json({
            message: 'Registration error'
        });
    }
};

export const login = async (req, res) => {
    try {
        const { login, password } = req.body;
        const user = await UserModel.findOne({ login });

        if (!user) {
            return res.status(400).json({
                message: "Wrong login or password"
            });
        }

        const isValidPassword = await bcrypt.compare(password, user._doc.passwordHash)

        if (!isValidPassword) {
            return res.status(400).json({
                message: "Wrong login or password"
            });
        }

        const token = jwt.sign(
            {
                _id: user._id
            },
            config.secred_key,
            {}
        );

        const {
            passwordHash: hash,
            ...userData
        } = user._doc;

        res.json({
            ...userData,
            token
        });

    } catch (err) {
        res.status(500).json({
            message: 'Something wrong'
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const {
            allowedTests,
            ...rest
        } = req.body;

        await UserModel.findByIdAndUpdate(req.userId, {
            ...rest,
            allowedTests: allowedTests < 0 ? 0 : allowedTests
        });

        res.json({
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: 'Cant update user'
        });
    }
};

export const getUser = async (req, res) => {
    try {
        const { username } = req.params;


        const user = await UserModel.findOne({ login: username });

        res.json({
            name: user.name,
            login: user.login,
            allowedTests: user.allowedTests,
            lastTestDate: user.lastTestDate
        });

    } catch (err) {
        res.status(500).json({
            message: 'Something wrong'
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        await WordModel.deleteMany({
            userId: req.userId
        });

        await UserModel.findOneAndDelete({
            _id: req.userId
        });

        res.json({
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: 'Cant delete user'
        });
    }
};
