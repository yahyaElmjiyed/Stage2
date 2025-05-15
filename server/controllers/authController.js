const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { body, validationResult } = require('express-validator'); // Pour valider les entrées utilisateur

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('❌ JWT_SECRET doit être défini dans les variables d\'environnement.');
}

// Fonction pour l'inscription
exports.register = [
  // Validation des données
  body('name').trim().notEmpty().withMessage('Le nom est requis.'),
  body('email').isEmail().withMessage('Email invalide.').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères.'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
      }

      // Hacher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Créer un nouvel utilisateur
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'client', // Par défaut, les nouveaux utilisateurs sont des clients
      });

      res.status(201).json({
        message: 'Compte créé avec succès.',
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
      });
    } catch (error) {
      console.error('Erreur lors de la création du compte :', error);
      res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
  },
];

// Fonction pour la connexion
exports.login = [
  // Validation des données
  body('email').isEmail().withMessage('Email invalide.').normalizeEmail(),
  body('password').notEmpty().withMessage('Le mot de passe est requis.'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Vérifier si l'utilisateur existe
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé.' });
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Mot de passe incorrect.' });
      }

      // Générer un token JWT
      const token = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '1d' } // Le token expire après 1 jour
      );

      res.status(200).json({
        message: 'Connexion réussie.',
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      });
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
  },
];

// Fonction pour vérifier le token
exports.verifyToken = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Récupérer le token depuis le header Authorization

  if (!token) {
    return res.status(401).json({ message: 'Token manquant.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.status(200).json({ message: 'Token valide.', user: decoded });
  } catch (error) {
    console.error('Erreur lors de la vérification du token :', error);
    res.status(401).json({ message: 'Token invalide.' });
  }
};