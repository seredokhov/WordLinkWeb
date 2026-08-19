import mongoose from 'mongoose';

const DictionarySchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Dictionary', DictionarySchema);
