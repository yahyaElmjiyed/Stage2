const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'votre_clé_secrète'; // Utilisez une variable d'environnement pour plus de sécurité

// Middleware pour vérifier le token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Récupérer le token dans le header Authorization

  if (!token) {
    return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Ajouter les informations de l'utilisateur au req
    next();
  } catch (error) {
    console.error('Erreur de vérification du token:', error);
    res.status(403).json({ message: 'Token invalide.' });
  }
};

// Middleware pour vérifier les rôles (par exemple, admin)
const authorizeRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: 'Accès refusé. Rôle insuffisant.' });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRole,
};