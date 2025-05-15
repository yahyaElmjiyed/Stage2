const express = require('express');
const logementsRoutes = require('./logements');
const reservationsRoutes = require('./reservations');
const servicesRoutes = require('./services');
const router = express.Router();

// Ajouter les routes client
router.use('/logements', logementsRoutes);
router.use('/reservations', reservationsRoutes);
router.use('/services', servicesRoutes);

module.exports = router;