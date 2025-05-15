const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  reservation_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  method: {
    type: DataTypes.ENUM('card', 'paypal', 'cash', 'transfer'),
    allowNull: false,
    defaultValue: 'card'
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'refunded', 'failed'),
    allowNull: false,
    defaultValue: 'pending'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.01
    }
  },
  payment_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'payments',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['reservation_id'] }
  ]
});

module.exports = Payment;
