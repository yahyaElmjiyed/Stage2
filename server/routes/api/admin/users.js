const express = require('express');
const router = express.Router();

// Exemple de route pour les utilisateurs
router.get('/', (req, res) => {
  res.json({ message: 'Liste des utilisateurs.' });
});

module.exports = router; // Assure-toi que le routeur est exporté correctement