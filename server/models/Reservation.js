const { DataTypes, Op } = require('sequelize');
const { sequelize } = require('../config/database');
const Logement = require('./Logement');
const User = require('./User');

const Reservation = sequelize.define('Reservation', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  logement_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Logement,
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: { msg: 'Date de début invalide' },
      isAfterToday(value) {
        if (new Date(value) < new Date().setHours(0, 0, 0, 0)) {
          throw new Error('La date de début doit être aujourd\'hui ou ultérieure.');
        }
      }
    }
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: { msg: 'Date de fin invalide' },
      isAfterStartDate(value) {
        if (new Date(value) <= new Date(this.start_date)) {
          throw new Error('La date de fin doit être postérieure à la date de début.');
        }
      }
    }
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0.01],
        msg: 'Le prix total doit être supérieur à 0.'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
    allowNull: false,
    defaultValue: 'pending'
  },
  payment_status: {
    type: DataTypes.ENUM('unpaid', 'partial', 'paid', 'refunded'),
    allowNull: false,
    defaultValue: 'unpaid'
  },
  special_requests: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'reservations',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['logement_id'] },
    { fields: ['user_id'] },
    { fields: ['status'] },
    { fields: ['start_date', 'end_date'] }
  ],
  hooks: {
    beforeValidate: async (reservation) => {
      // Sécurité des dates
      if (typeof reservation.start_date === 'string') {
        reservation.start_date = new Date(reservation.start_date);
      }
      if (typeof reservation.end_date === 'string') {
        reservation.end_date = new Date(reservation.end_date);
      }

      // Calcul automatique du prix total
      if (reservation.logement_id && reservation.start_date && reservation.end_date) {
        const logement = await Logement.findByPk(reservation.logement_id);
        if (logement) {
          const dayCount = Math.ceil(
            (new Date(reservation.end_date) - new Date(reservation.start_date)) /
            (1000 * 60 * 60 * 24)
          );
          reservation.total_price = dayCount * logement.prix_par_nuit;
        }
      }
    }
  }
});

// Relations : chaque réservation appartient à un utilisateur et un logement
Reservation.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
  onDelete: 'RESTRICT'
});

Reservation.belongsTo(Logement, {
  foreignKey: 'logement_id',
  as: 'logement',
  onDelete: 'RESTRICT'
});

// 🔍 Méthode statique : vérifier disponibilité d’un logement
Reservation.checkAvailability = async function (logementId, startDate, endDate, excludeReservationId = null) {
  const where = {
    logement_id: logementId,
    status: {
      [Op.notIn]: ['cancelled', 'completed']
    },
    [Op.or]: [
      {
        start_date: { [Op.between]: [startDate, endDate] }
      },
      {
        end_date: { [Op.between]: [startDate, endDate] }
      },
      {
        [Op.and]: [
          { start_date: { [Op.lte]: startDate } },
          { end_date: { [Op.gte]: endDate } }
        ]
      }
    ]
  };

  if (excludeReservationId) {
    where.id = { [Op.ne]: excludeReservationId };
  }

  const conflictCount = await this.count({ where });
  return conflictCount === 0;
};

module.exports = Reservation;
