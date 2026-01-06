import { body } from 'express-validator';

export const registrationValidator = [
    body('login', 'Login has been more than 3 symbols').isLength({ min: 4 }),
    body('name', 'Name has been more than 3 symbols').isLength({ min: 4 }),
    body('password', 'Password has been more than 3 symbols').isLength({ min: 5 })
];

export const loginValidator = [
    body('login').isLength({ min: 4 }),
    body('password').isLength({ min: 5 })
];
