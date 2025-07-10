// Clase base para todos los errores de la API.
// Permite que todos nuestros errores personalizados tengan un código de estado.
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error para validaciones fallidas (400 Bad Request)
class ValidationError extends ApiError {
  constructor(message = 'Datos inválidos') {
    super(message, 400);
  }
}

// Error para autenticación fallida (401 Unauthorized)
class AuthenticationError extends ApiError {
  constructor(message = 'Credenciales inválidas', statusCode = 401) {
    super(message, statusCode);
  }
}

// Error para recursos no encontrados (404 Not Found)
class NotFoundError extends ApiError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404);
  }
}

module.exports = { ApiError, ValidationError, AuthenticationError, NotFoundError };