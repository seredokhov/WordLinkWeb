import mongoose from 'mongoose';

const DictionaryWordSchema = mongoose.Schema(
    {
        dictionaryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dictionary',
            required: true
        },
        word: {
            type: String,
            required: true
        },
        translate: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

DictionaryWordSchema.index({ dictionaryId: 1, word: 1 }, { unique: true });

export default mongoose.model('DictionaryWord', DictionaryWordSchema);
