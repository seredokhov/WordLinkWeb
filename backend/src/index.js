import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import config from './../config.js';

import { loginValidator, registrationValidator } from './validations/index.js';
import { checkAuth, checkAdmin, handleErrors } from './middlewares/index.js';
import { UserController, WordController, AdminController } from './controllers/index.js';

mongoose.connect(config.db_url)
    .then(() => console.log('Database OK'))
    .catch(err => console.log('Database ERROR', err));

const app = express();

app.use(express.json());
app.use(cors());

app.post('/admin/login', AdminController.login);
app.get('/admin/users', checkAdmin, AdminController.getAllUsers);
app.patch('/admin/user/update', checkAdmin, AdminController.updateUser);
app.post('/admin/user/create', checkAdmin, AdminController.createNewUser);
app.delete('/admin/user/delete/:id', checkAdmin, AdminController.deleteUser);
app.get('/admin/words', checkAdmin, AdminController.getAllWords);
app.delete('/admin/word/delete/:id', checkAdmin, AdminController.deleteWord);

app.post('/auth/login', loginValidator, UserController.login);
app.post('/auth/registration', registrationValidator, handleErrors, UserController.createUser);
app.patch('/user/update', checkAuth, handleErrors, UserController.updateUser);
app.get('/user/:username', checkAuth, handleErrors, UserController.getUser);
app.delete('/user/delete', checkAuth, handleErrors, UserController.deleteUser);

app.post('/word/add', checkAuth, handleErrors, WordController.createWord);
app.patch('/word/update', checkAuth, handleErrors, WordController.updateWord);
app.post('/words/merge', checkAuth, handleErrors, WordController.mergeWords);
app.patch('/word/save-results', checkAuth, WordController.saveResults);
app.get('/words', checkAuth, WordController.getWords);
app.delete('/word/delete/:id', checkAuth, WordController.deleteWord);

app.listen(config.port, err => {
    if (err) {
        console.log(err);
    }

    console.log(`Server OK on port ${config.port}` );
});
