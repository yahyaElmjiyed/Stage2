const { Sequelize } = require('sequelize');
require('dotenv').config();

// ✅ Liste des variables requises
const REQUIRED_ENV_VARS = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST'];

REQUIRED_ENV_VARS.forEach((key) => {
  if (typeof process.env[key] === 'undefined') {
    console.error(`❌ Variable d’environnement manquante : ${key}`);
    process.exit(1);
  }
});

// ✅ Création de l’instance Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD || '', // Accepte les mots de passe vides
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3307,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'production' ? false : console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      underscored: false,
      freezeTableName: false,
      timestamps: true,
    },
  }
);

// ✅ Fonction de test de la connexion
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie.');
  } catch (err) {
    console.error('❌ Échec de connexion à la base de données :', err.message);
    process.exit(1);
  }
};

// ✅ Exports
module.exports = {
  sequelize,
  testConnection,
};
