const express = require('express');
const router = express.Router();

// Exemple de route pour les réservations
router.get('/', (req, res) => {
  res.json({ message: 'Liste des réservations pour les clients.' });
});

module.exports = router;