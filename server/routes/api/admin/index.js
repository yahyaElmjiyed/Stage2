const express = require('express');
const dashboardRoutes = require('./dashboard');
const logementsRoutes = require('./logements');
const reservationsRoutes = require('./reservations');
const usersRoutes = require('./users');
const router = express.Router();

// Ajouter les routes admin
router.use('/dashboard', dashboardRoutes);
router.use('/logements', logementsRoutes);
router.use('/reservations', reservationsRoutes);
router.use('/users', usersRoutes);

module.exports = router;