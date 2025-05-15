const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_par_defaut';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '1d';

/**
 * Génère un token JWT signé
 * @param {Object} user - L'utilisateur (doit contenir id et role)
 * @returns {String} Token JWT signé
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
};

/**
 * Middleware pour vérifier le token JWT dans l'en-tête Authorization
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant ou format invalide.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Injecte les infos du token dans req.user
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token invalide ou expiré.' });
  }
};

/**
 * Middleware pour vérifier que l'utilisateur a le rôle requis
 * @param {String} role - Rôle requis ('admin', 'client', etc.)
 */
const verifyRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: 'Accès interdit. Rôle insuffisant.' });
    }
    next();
  };
};

module.exports = {
  generateToken,
  verifyToken,
  verifyRole,
};
