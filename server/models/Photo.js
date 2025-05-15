const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // ✅ Corrigé ici
const Logement = require('./Logement');


const Photo = sequelize.define('Photo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  logement_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Logement,
      key: 'id'
    }
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isUrl: true // Vérifie que c'est une URL valide
    }
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'photos',
  timestamps: true,
  indexes: [
    { fields: ['logement_id'] } // Index sur logement_id
  ]
});

// Relation avec Logement
Photo.belongsTo(Logement, { foreignKey: 'logement_id', onDelete: 'CASCADE', as: 'logement' });

module.exports = Photo;