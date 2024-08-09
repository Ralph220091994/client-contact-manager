require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Connected to MongoDB Atlas');
})
.catch(err => {
    console.error('Database connection error:', err);
});

const clientRoutes = require('./routes/clientRoutes');
const contactRoutes = require('./routes/contactRoutes');

app.use('/clients', clientRoutes);
app.use('/contacts', contactRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
