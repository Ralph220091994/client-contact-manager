const mongoose = require('mongoose');
//counter for number of contacts
const counterSchema = new mongoose.Schema({
    name: String,
    sequence_value: { type: Number, default: 0 }
});

module.exports = mongoose.model('Counter', counterSchema);
