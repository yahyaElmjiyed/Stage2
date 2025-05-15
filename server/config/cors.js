require('dotenv').config();

const allowedOrigin = process.env.NODE_ENV === 'production'
  ? process.env.CORS_ORIGIN
  : 'http://localhost:3000';

if (process.env.NODE_ENV === 'production' && !allowedOrigin) {
  throw new Error('❌ CORS_ORIGIN doit être défini dans le fichier .env pour la production.');
}

const corsOptions = {
  origin: allowedOrigin,
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = corsOptions;
