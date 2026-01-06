import mongoose from 'mongoose';

const UserSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        login: {
            type: String,
            required: true,
            unique: true
        },
        passwordHash: {
            type: String,
            required: true
        },
        isDataSynchronized: {
            type: Boolean,
            default: true
        },
        lastTestDate: {
            type: Date,
            default: null
        },
        allowedTests: {
            type: Number,
            default: 3,
            minimum: 0
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('User', UserSchema);
