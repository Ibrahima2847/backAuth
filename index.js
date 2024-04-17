const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 

const app = express();
const authRoutes = require('./routes/auth');
const protectedRoute = require('./routes/protectedRoute');
require('dotenv').config(); 

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Erreur de connexion à MongoDB :'));
db.once('open', () => {
    console.log('Connecté à MongoDB');
});

// Utilise le middleware cors pour autoriser les requêtes CORS
app.use(cors()); 

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/protected', protectedRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
