const express = require('express');
const router = express.Router();

// Exemple de route pour les réservations
router.get('/', (req, res) => {
  res.json({ message: 'Liste des réservations.' });
});

module.exports = router; // Assure-toi que le routeur est exporté correctement