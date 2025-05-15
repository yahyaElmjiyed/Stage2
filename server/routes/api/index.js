const express = require('express');
const router = express.Router();

// Importer les sous-routes
const authRoutes = require('./auth');
const adminRoutes = require('./admin');
// Tu peux ajouter clientRoutes aussi si nécessaire
const clientRoutes = require('./client');

// Définir les routes
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/client', clientRoutes); // optionnel selon ton app

module.exports = router;
