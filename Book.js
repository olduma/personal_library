const mongoose = require('mongoose');

// Define the schema
const Book = new mongoose.Schema({
    comments: [String],
    title: {
        type: String,
        required: true,
    },
    commentcount: {
        type: Number,
        default: 0,
    }
});


// Create a model from the schema
module.exports = mongoose.model('Book', Book);
