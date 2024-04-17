const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User registration
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed' });
    }

});



// User login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const secretKey = process.env.JWT_SECRET_KEY; // Utilisez la variable d'environnement pour la clé secrète
        const token = jwt.sign({ userId: user._id }, secretKey, {
            expiresIn: '1h',
        });
        res.status(200).json({ token, username });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await User.destroy({ where: { id } });
        res.json({ message: 'User supprimé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
    } 
});

router.put('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const existingUser = await User.findByPk(id);
        if (existingUser) {
            // Mettre à jour les données de l'utilisateur
            res.json({ message: 'Mise à jour réussie!' });
        } else {
            res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
    }
});

router.get('/getUserById/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByPk(id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
    }
});


module.exports = router;
