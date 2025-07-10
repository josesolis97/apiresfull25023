// ===========================================
// 13. MIDDLEWARE/ERROR_HANDLER.JS
// ===========================================
const { db } = require('../config/firebase');
const { ApiError } = require('../errors/custom_errors');

const errorHandler = async (error, req, res, next) => {
  console.error('Error capturado:', error);

  // Intentar guardar el error en Firebase Firestore
  if (db) { // Solo intentar si la conexión a la BD existe
    try {
      await db.collection('logsErrores').add({
        message: error.message,
        stack: error.stack,
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
        userAgent: req.headers['user-agent'] || null,
        // puedes agregar más info que necesites
      });
    } catch (firebaseError) {
      console.error('Error guardando log en Firebase:', firebaseError.message);
    }
  }

  // Si el error es una instancia de nuestros errores personalizados, lo manejamos.
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: error.name
    });
  }

  // Si es un error inesperado, devolvemos un 500 genérico.
  return res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Error Interno del Servidor'
  });
};
module.exports = errorHandler;
