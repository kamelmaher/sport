const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    link: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Ad', adSchema);