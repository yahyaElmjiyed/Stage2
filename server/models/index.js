const { sequelize, DataTypes } = require('../config/database');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

// Initialisation de l'objet qui contiendra tous les modèles
const db = { sequelize };

// ✅ Import des modèles explicites
const User = require('./User');
const Logement = require('./Logement');
const Reservation = require('./Reservation');
const Photo = require('./Photo');
const Payment = require('./Payment');

// Import automatique de tous les modèles du répertoire (optionnel, pour évolution future)
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file !== 'index.js'
    );
  })
  .forEach(file => {
    // Cette partie est commentée car vous importez déjà manuellement vos modèles
    // Mais elle peut être utile si vous ajoutez de nouveaux modèles à l'avenir
    // const model = require(path.join(__dirname, file));
    // db[model.name] = model;
  });

// Ajout des modèles à l'objet db
db.User = User;
db.Logement = Logement;
db.Reservation = Reservation;
db.Photo = Photo;
db.Payment = Payment;

// 🔗 Définition des relations

// --- User ↔ Reservation
User.hasMany(Reservation, {
  foreignKey: 'user_id',
  as: 'userReservations'
});
Reservation.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'reservationUser'
});

// --- Logement ↔ Reservation
Logement.hasMany(Reservation, {
  foreignKey: 'logement_id',
  as: 'logementReservations'
});
Reservation.belongsTo(Logement, {
  foreignKey: 'logement_id',
  as: 'reservationLogement'
});

// --- Logement ↔ Photo
Logement.hasMany(Photo, {
  foreignKey: 'logement_id',
  as: 'photos',
  onDelete: 'CASCADE',  // Ajouté pour que la suppression d'un logement supprime ses photos
  onUpdate: 'CASCADE'
});
Photo.belongsTo(Logement, {
  foreignKey: 'logement_id',
  as: 'photoLogement'
});

// --- Reservation ↔ Payment
Reservation.hasOne(Payment, {
  foreignKey: 'reservation_id',
  as: 'reservationPayment',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Payment.belongsTo(Reservation, {
  foreignKey: 'reservation_id',
  as: 'paymentReservation'
});

// --- User ↔ Payment
User.hasMany(Payment, {
  foreignKey: 'user_id',
  as: 'userPayments',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});
Payment.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'paymentUser'
});

// Synchronisation de toutes les relations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// ✅ Export centralisé
module.exports = db;