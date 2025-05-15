const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Affiche l'erreur dans la console pour le débogage
  res.status(err.status || 500).json({
    message: err.message || 'Une erreur interne est survenue.',
  });
};

module.exports = errorHandler;