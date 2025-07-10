const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Debe proporcionar un email válido.',
    'any.required': 'El email es un campo requerido.'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'La contraseña debe tener al menos 6 caracteres.',
    'any.required': 'La contraseña es un campo requerido.'
  }),
  name: Joi.string().min(2).required().messages({
    'any.required': 'El nombre es un campo requerido.'
  }),
  role: Joi.string().valid('admin', 'user').optional().messages({
    'any.only': 'El rol debe ser "admin" o "user".'
  })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Debe proporcionar un email válido.',
    'any.required': 'El email es un campo requerido.'
  }),
  password: Joi.string().required().messages({
    'any.required': 'La contraseña es un campo requerido.'
  })
});

module.exports = { registerSchema, loginSchema };