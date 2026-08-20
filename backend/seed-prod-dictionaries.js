import { readFileSync } from 'fs';
import mongoose from 'mongoose';
import config from './config.js';
import DictionaryModel from './src/models/dictionary.js';
import DictionaryWordModel from './src/models/dictionaryWord.js';

const MAX_WORD_LENGTH = 16;
const MIN_WORDS = 11;
const DEFAULT_DATA_PATH = './dictionaries.prod.json';

const dataPath = process.argv[2] || DEFAULT_DATA_PATH;

const loadDictionaries = () => {
    const rawContent = readFileSync(dataPath, 'utf8');
    const parsed = JSON.parse(rawContent);

    if (!Array.isArray(parsed)) {
        throw new Error('Dictionary data must be a JSON array');
    }

    return parsed;
};

const capitalize = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
        return trimmed;
    }

    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

const isValidLength = (value) => value.trim().length > 0 && value.trim().length <= MAX_WORD_LENGTH;

const prepareWords = (words) => {
    const seen = new Set();

    return words
        .map(({ word, translate }) => ({
            word: capitalize(word),
            translate: capitalize(translate)
        }))
        .filter(({ word, translate }) => {
            if (!isValidLength(word) || !isValidLength(translate)) {
                return false;
            }

            const key = word.toLowerCase();
            if (seen.has(key)) {
                return false;
            }

            seen.add(key);
            return true;
        });
};

const prepareDictionaries = (dictionaries) => {
    const accepted = [];
    const skipped = [];

    for (const dictionary of dictionaries) {
        const words = prepareWords(dictionary.words);

        if (words.length <= 10) {
            skipped.push({
                title: dictionary.title,
                theme: dictionary.theme,
                wordsCount: words.length
            });
            continue;
        }

        accepted.push({
            title: dictionary.title,
            theme: dictionary.theme,
            words
        });
    }

    return { accepted, skipped };
};

const seedProdDictionaries = async () => {
    const dictionaries = loadDictionaries();
    const { accepted, skipped } = prepareDictionaries(dictionaries);
    const dictionaryTitles = accepted.map((dictionary) => dictionary.title);

    await mongoose.connect(config.db_url);

    const existingDictionaries = await DictionaryModel.find({
        title: { $in: dictionaryTitles }
    });
    const existingDictionaryIds = existingDictionaries.map((dictionary) => dictionary._id);

    if (existingDictionaryIds.length > 0) {
        await DictionaryWordModel.deleteMany({
            dictionaryId: { $in: existingDictionaryIds }
        });
        await DictionaryModel.deleteMany({
            _id: { $in: existingDictionaryIds }
        });
    }

    const failed = [];

    for (const dictionaryData of accepted) {
        let dictionary;

        try {
            dictionary = await DictionaryModel.create({
                title: dictionaryData.title,
                theme: dictionaryData.theme
            });

            const words = dictionaryData.words.map((item) => ({
                dictionaryId: dictionary._id,
                word: item.word,
                translate: item.translate
            }));

            await DictionaryWordModel.insertMany(words);
        } catch (error) {
            if (dictionary?._id) {
                await DictionaryWordModel.deleteMany({
                    dictionaryId: dictionary._id
                });
                await DictionaryModel.deleteOne({
                    _id: dictionary._id
                });
            }

            failed.push({
                title: dictionaryData.title,
                error: error.message
            });
            console.error(`Failed: ${dictionaryData.title}`, error.message);
        }
    }

    const created = accepted.filter(
        (dictionary) => !failed.some((item) => item.title === dictionary.title)
    );

    console.log('Prod dictionary seed completed');
    console.log(`Data file: ${dataPath}`);
    console.log(`Created dictionaries: ${created.length}`);
    console.log(`Failed dictionaries: ${failed.length}`);
    console.log(`Skipped dictionaries: ${skipped.length}`);

    if (created.length > 0) {
        console.log('Created:', created.map((dictionary) => `${dictionary.title} (${dictionary.words.length})`).join(', '));
    }

    if (failed.length > 0) {
        console.log('Failed:', failed.map((item) => `${item.title}: ${item.error}`).join(', '));
    }

    if (skipped.length > 0) {
        console.log('Skipped:', skipped.map((dictionary) => `${dictionary.title} [${dictionary.wordsCount}]`).join(', '));
    }

    await mongoose.disconnect();

    if (failed.length > 0) {
        process.exitCode = 1;
    }
};

seedProdDictionaries().catch((error) => {
    console.error('Prod dictionary seed failed:', error);
    process.exit(1);
});
