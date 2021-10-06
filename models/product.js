const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    imagePath: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    }
});

module.exports = mongoose.model('Product', schema);