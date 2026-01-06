import { body } from 'express-validator';

export const wordValidator = [
    body('word').exists().not().isEmpty(),
    body('translate').exists().not().isEmpty()
];
