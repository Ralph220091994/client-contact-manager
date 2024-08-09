const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    clientCode: { type: String, unique: true },
    isSaved: { type: Boolean, default: false }, //field to track if client is saved
    contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
});

const Client = mongoose.model('Client', clientSchema);


module.exports = Client;
