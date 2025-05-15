const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Logement = sequelize.define('Logement', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Le nom du logement est requis.' },
      len: {
        args: [3, 100],
        msg: 'Le nom doit contenir entre 3 et 100 caractères.'
      }
    }
  },
  type: {
    type: DataTypes.ENUM('chambre', 'suite', 'villa', 'appartement'),
    allowNull: false,
    defaultValue: 'chambre'
  },
  capacite: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    validate: {
      isInt: { msg: 'La capacité doit être un entier.' },
      min: { args: [1], msg: 'La capacité minimale est 1.' },
      max: { args: [10], msg: 'La capacité maximale est 10.' }
    }
  },
  prix_par_nuit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: true,
      min: { args: [0.01], msg: 'Le prix doit être supérieur à 0.' }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: {
        args: [0, 2000],
        msg: 'La description ne peut excéder 2000 caractères.'
      }
    }
  },
  availability: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      isUrl: {
        msg: 'Doit être une URL valide.'
      }
    }
  },
  amenities: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      wifi: false,
      climatisation: false,
      petit_dejeuner: false,
      service_chambre: false
    }
  }
}, {
  tableName: 'logements',
  timestamps: true,
  paranoid: true, // Active le soft delete (deletedAt)
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt']
    }
  },
  scopes: {
    withDates: {
      attributes: { include: ['createdAt', 'updatedAt'] }
    }
  },
  indexes: [
    { fields: ['type'] },
    { fields: ['availability'] },
    { fields: ['prix_par_nuit'] }
  ],
  hooks: {
    beforeValidate: (logement) => {
      if (logement.image_url === '') logement.image_url = null;
    }
  }
});

// 🔢 Méthode personnalisée pour afficher le prix formaté (ex: 99,99 €)
Logement.prototype.getFormattedPrice = function () {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(this.prix_par_nuit);
};

module.exports = Logement;
