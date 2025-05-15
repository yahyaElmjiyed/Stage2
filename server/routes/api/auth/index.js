const express = require('express');
const loginRoute = require('./login');
const registerRoute = require('./register'); // Importer la route register
const router = express.Router();

// Ajouter les routes d'authentification
router.use('/login', loginRoute);
router.use('/register', registerRoute); // Ajouter la route register

module.exports = router;