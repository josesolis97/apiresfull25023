const { ValidationError } = require('../errors/custom_errors');

// Middleware de validación para el cuerpo de la petición (req.body)
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return next(new ValidationError(errorMessage));
  }
  req.body = value; // Sobrescribe el body con los datos validados y limpios
  next();
};

// Middleware de validación para los parámetros de la URL (req.query)
const validateQuery = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.query, { abortEarly: false, stripUnknown: true });
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return next(new ValidationError(`Parámetros de consulta inválidos: ${errorMessage}`));
  }
  req.query = value; // Sobrescribe la query con los datos validados y limpios
  next();
};

module.exports = { validate, validateQuery };