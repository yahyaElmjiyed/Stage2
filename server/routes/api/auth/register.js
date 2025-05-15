const express = require('express');
const router = express.Router();
const { User } = require('../../../models');

// Route POST /register
router.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Créer un nouvel utilisateur avec rôle forcé à "client"
    const user = await User.create({
      name,
      email,
      password, // pas de hash ici ! Le hook Sequelize s’en occupe.
      role: 'client',
    });

    // Exclure le mot de passe de la réponse
    const { password: _, ...userData } = user.toJSON();

    res.status(201).json({ message: 'Utilisateur créé avec succès.', user: userData });
  } catch (error) {
    console.error('Erreur lors de l\'inscription :', error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

module.exports = router;
