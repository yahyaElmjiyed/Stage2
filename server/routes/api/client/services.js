const express = require('express');
const router = express.Router();

// Exemple de route pour les services
router.get('/', (req, res) => {
  res.json({ message: 'Liste des services pour les clients.' });
});

module.exports = router;