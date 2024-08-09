const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const Client = require('../models/Client');

// Get all contacts
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find().populate('clients').sort({ surname: 1, name: 1 });
        if (contacts.length === 0) {
            return res.status(404).send("No contact(s) found.");
        }
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new contact
router.post('/', async (req, res) => {
    const { name, surname, email } = req.body;
    const contact = new Contact({ name, surname, email });

    try {
        const newContact = await contact.save();
        res.status(201).json(newContact);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Link a client to a contact
router.put('/:contactId/linkClient/:clientId', async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.contactId);
        const client = await Client.findById(req.params.clientId);

        if (!contact || !client) {
            return res.status(404).json({ message: 'Contact or Client not found' });
        }

        contact.clients.push(client._id);
        client.contacts.push(contact._id);

        await contact.save();
        await client.save();

        res.status(200).json({ message: 'Client linked to contact' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Unlink a client from a contact
router.put('/:contactId/unlinkClient/:clientId', async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.contactId);
        const client = await Client.findById(req.params.clientId);

        if (!contact || !client) {
            return res.status(404).json({ message: 'Contact or Client not found' });
        }

        contact.clients.pull(client._id);
        client.contacts.pull(contact._id);

        await contact.save();
        await client.save();

        res.status(200).json({ message: 'Client unlinked from contact' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Fetch all clients linked to a contact
router.get('/:contactId/clients', async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.contactId).populate('clients');
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json(contact.clients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific contact by ID
router.get('/:contactId', async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.contactId);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json(contact);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
