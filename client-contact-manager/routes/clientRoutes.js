const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const Contact = require('../models/Contact');
const Counter = require('../models/Counter');

// Get all clients
router.get('/', async (req, res) => {
    try {
        const clients = await Client.find().populate('contacts').sort({ name: 1 });
        if (clients.length === 0) {
            return res.status(200).json([]); // Return an empty array with a 200 status
        }
        res.json(clients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Create a new client
router.post('/', async (req, res) => {
    const { name } = req.body;
    const clientCode = await generateClientCode(name);
    const client = new Client({ name, clientCode });

    try {
        const newClient = await client.save();
        res.status(201).json(newClient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

async function generateClientCode(name) {
    let prefix = '';

    const words = name.split(' ');

    if (words.length === 1) {
        // If it's a single word, take the first three letters
        prefix = name.substring(0, 3).toUpperCase();
    } else if (words.length === 2) {
        const firstLetter = words[0][0].toUpperCase();
        
        // Determine which word is longer
        const longerWord = words[0].length >= words[1].length ? words[0] : words[1];
        const middleLetterIndex = Math.floor(longerWord.length / 2);
        const middleLetter = longerWord[middleLetterIndex].toUpperCase();
        
        const lastLetter = words[1][0].toUpperCase();
        
        prefix = firstLetter + middleLetter + lastLetter;
    } else if (words.length === 3) {
        // If there are three words, take the first letter of the first three words
        prefix = words.slice(0, 3).map(word => word[0].toUpperCase()).join('');
    } else {
        // If there are four or more words
        const firstLetter = words[0][0].toUpperCase();

        // Calculate the middle word index
        const middleIndex = Math.ceil(words.length / 2) - 1; // Adjusted for zero-based index
        const middleLetter = words[middleIndex][0].toUpperCase();

        const lastLetter = words[words.length - 1][0].toUpperCase();

        if (words.length % 2 === 0) {
            // For even number of words, find the word with more characters
            const wordWithMoreChars = words[middleIndex].length >= words[middleIndex - 1].length ? words[middleIndex] : words[middleIndex - 1];
            prefix = firstLetter + wordWithMoreChars[0].toUpperCase() + lastLetter;
        } else {
            // For odd number of words, use the middle word
            prefix = firstLetter + middleLetter + lastLetter;
        }
    }

    // Fetch or initialize the counter
    let counter = await Counter.findOne({ name: 'client_code' });
    if (!counter) {
        counter = new Counter({ name: 'client_code', sequence_value: 1 });
    } else {
        counter.sequence_value += 1;
    }

    await counter.save();

    // Pad the numeric part with leading zeros if necessary
    const numericPart = counter.sequence_value.toString().padStart(3, '0');

    // Return the concatenated client code
    return `${prefix}${numericPart}`;
}




// Link a contact to a client
router.put('/:clientId/linkContact/:contactId', async (req, res) => {
    try {
        const client = await Client.findById(req.params.clientId);
        const contact = await Contact.findById(req.params.contactId);

        if (!client || !contact) {
            return res.status(404).json({ message: 'Client or Contact not found' });
        }

        client.contacts.push(contact._id);
        contact.clients.push(client._id);

        await client.save();
        await contact.save();

        res.status(200).json({ message: 'Contact linked to client' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Unlink a contact from a client
router.put('/:clientId/unlinkContact/:contactId', async (req, res) => {
    try {
        const client = await Client.findById(req.params.clientId);
        const contact = await Contact.findById(req.params.contactId);

        if (!client || !contact) {
            return res.status(404).json({ message: 'Client or Contact not found' });
        }

        client.contacts.pull(contact._id);
        contact.clients.pull(client._id);

        await client.save();
        await contact.save();

        res.status(200).json({ message: 'Contact unlinked from client' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Save client (update isSaved field)
router.put('/:clientId/save', async (req, res) => {
    try {
        const client = await Client.findById(req.params.clientId);

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        client.isSaved = true;
        await client.save();

        res.status(200).json(client);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific client by ID
router.get('/:clientId', async (req, res) => {
    try {
        const client = await Client.findById(req.params.clientId).populate('contacts');
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json(client);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Fetch all contacts linked to a specific client
router.get('/:clientId/contacts', async (req, res) => {
    try {
        const clientId = req.params.clientId;

        // Find the client by ID and populate the linked contacts
        const client = await Client.findById(clientId).populate('contacts');

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        // Return the contacts linked to the client
        res.status(200).json(client.contacts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contacts', error: error.message });
    }
});

module.exports = router;
