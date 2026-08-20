import mongoose from 'mongoose';

const UserDictionarySchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        dictionaryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dictionary',
            required: true
        },
        totalWords: {
            type: Number,
            required: true,
            min: 1
        },
        bestCorrectAnswers: {
            type: Number,
            default: 0,
            min: 0
        },
        bestProgressPercent: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        lastCorrectCount: {
            type: Number,
            default: 0,
            min: 0
        },
        lastTestDate: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

UserDictionarySchema.index({ userId: 1, dictionaryId: 1 }, { unique: true });

export default mongoose.model('UserDictionary', UserDictionarySchema);
