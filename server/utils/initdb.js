const { User } = require('../models');

async function createAdminIfNotExists() {
  const adminEmail = 'admin@example.com';

  const existingAdmin = await User.findOne({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await User.create({
      name: 'Admin',
      email: adminEmail,
      password: 'adminpassword', // sera hashé automatiquement par le hook beforeSave
      role: 'admin',
      status: 'active'
    });
    console.log('✅ Admin par défaut créé');
  } else {
    console.log('ℹ️ Admin déjà existant');
  }
}

module.exports = { createAdminIfNotExists };
