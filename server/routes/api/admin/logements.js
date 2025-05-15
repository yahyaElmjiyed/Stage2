const express = require('express');
const router = express.Router();

// Exemple de route pour les logements
router.get('/', (req, res) => {
  res.json({ message: 'Liste des logements.' });
});

module.exports = router; // Assure-toi que le routeur est exporté correctement