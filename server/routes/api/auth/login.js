const express = require('express');
const router = express.Router();
const { User } = require('../../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Route POST /login
router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Vérifier le statut (facultatif)
    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Compte inactif. Veuillez contacter un administrateur.' });
    }

    // Comparer le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    // Générer le token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Préparer réponse sans le mot de passe
    const { password: _, ...userData } = user.toJSON();

    res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: userData // id, email, role, etc.
    });

  } catch (err) {
    console.error('Erreur lors de la connexion :', err);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

module.exports = router;
