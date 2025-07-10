// ===========================================
// 12. MIDDLEWARE/AUTH_MIDDLEWARE.JS
// ===========================================

const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('../errors/custom_errors');

const authenticate = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new AuthenticationError('Token de acceso requerido.');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    // Captura errores de token expirado o malformado y los pasa al errorHandler.
    next(new AuthenticationError('Token inválido o expirado.'));
  }
};

const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    // Usamos un error de autenticación con código 403 (Forbidden)
    return next(new AuthenticationError('Acceso denegado. Se requieren privilegios de administrador.', 403));
  }
  next();
};

module.exports = { authenticate, isAdmin };