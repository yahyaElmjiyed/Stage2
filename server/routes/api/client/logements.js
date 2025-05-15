const express = require('express');
const router = express.Router();

// Exemple de route pour les logements
router.get('/', (req, res) => {
  res.json({ message: 'Liste des logements pour les clients.' });
});

module.exports = router;