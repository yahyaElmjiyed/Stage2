const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');  // Ajouté pour la sécurité
const morgan = require('morgan');  // Ajouté pour le logging
const { sequelize } = require('./models');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middlewares/errorHandler');
const { createAdminIfNotExists } = require('./utils/initdb');
const path = require('path'); // Pour gérer les chemins de fichiers statiques

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware de sécurité
app.use(helmet());

// Middleware de logging
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Middleware CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Middleware pour parser le JSON et les URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dossier statique pour les uploads (si nécessaire)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware pour limiter les tentatives de brute force (optionnel)
if (process.env.NODE_ENV === 'production') {
  const rateLimit = require('express-rate-limit');
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limite chaque IP à 100 requêtes par fenêtre
    message: 'Trop de requêtes depuis cette IP, veuillez réessayer après 15 minutes'
  });
  app.use('/api/auth', limiter);
}

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: '🌍 API Hotel Management System opérationnelle.',
    version: '1.0.0',
    docs: '/api/docs' // Si vous ajoutez une documentation API
  });
});

// Routes principales
app.use('/api', apiRoutes);

// Route 404 pour les routes non-existantes
app.use((req, res, next) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route non trouvée' 
  });
});

// Gestion des erreurs globales
app.use(errorHandler);

// Démarrage du serveur avec initialisation DB
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données établie.');

    // En développement, on peut utiliser alter: true, mais en production c'est risqué
    const syncOptions = process.env.NODE_ENV === 'development' 
      ? { alter: true } 
      : {};
    
    await sequelize.sync(syncOptions);
    console.log('📦 Modèles synchronisés.');

    await createAdminIfNotExists();

    app.listen(PORT, () => {
      console.log(`🚀 Serveur lancé sur : http://localhost:${PORT}`);
      console.log(`🌍 Environnement : ${process.env.NODE_ENV}`);
    });

  } catch (error) {
    console.error('❌ Échec du démarrage du serveur :', error);
    process.exit(1);
  }
};

// Gestion des signaux d'arrêt pour une fermeture propre
process.on('SIGTERM', () => {
  console.log('SIGTERM reçu. Fermeture du serveur...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT reçu. Fermeture du serveur...');
  process.exit(0);
});

startServer();