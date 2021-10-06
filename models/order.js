const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    User: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    cart: {
        type: Object,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    paymentId: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('Order', schema);