const express = require('express');
const router = express.Router();
const { Reservation, User, Logement } = require('../../../models'); // Assurez-vous que ces modèles existent

// Exemple de route pour le tableau de bord
router.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur le tableau de bord admin.' });
});

// Route pour obtenir les statistiques du tableau de bord
router.get('/stats', async (req, res) => {
  try {
    // Obtenir le nombre total d'utilisateurs
    const totalUsers = await User.count();

    // Obtenir le nombre total de réservations
    const totalReservations = await Reservation.count();

    // Obtenir le nombre total de logements
    const totalLogements = await Logement.count();

    // Obtenir les réservations récentes
    const recentReservations = await Reservation.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['name', 'email'] }],
    });

    res.status(200).json({
      stats: {
        totalUsers,
        totalReservations,
        totalLogements,
      },
      recentReservations,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques :', error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

module.exports = router; // Assure-toi que le routeur est exporté correctement