import mongoose from 'mongoose';

const WordSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        word: {
            type: String,
            required: true
        },
        translate: {
            type: String,
            required: true
        },
        isFavorite: {
            type: Boolean,
            default: false
        },
        isLearned: {
            type: Boolean,
            default: false
        },
        progress: {
            type: Number,
            default: 0
        },
        lastUpdate: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

WordSchema.index({ userId: 1, word: 1 }, { unique: true });

export default mongoose.model('Word', WordSchema);
