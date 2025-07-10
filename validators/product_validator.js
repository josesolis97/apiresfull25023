const Joi = require('joi');
const { ValidationError } = require('../errors/custom_errors');

// Esquema para la creación de un producto.
// Todos los campos principales son requeridos.
const createProductSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    'string.base': 'El nombre debe ser texto.',
    'string.empty': 'El nombre no puede estar vacío.',
    'string.min': 'El nombre debe tener al menos 3 caracteres.',
    'any.required': 'El nombre es un campo requerido.'
  }),
  description: Joi.string().max(500).required().messages({
    'string.base': 'La descripción debe ser texto.',
    'string.empty': 'La descripción no puede estar vacía.',
    'any.required': 'La descripción es un campo requerido.'
  }),
  price: Joi.number().positive().required().messages({
    'number.base': 'El precio debe ser un número.',
    'number.positive': 'El precio debe ser un número positivo.',
    'any.required': 'El precio es un campo requerido.'
  }),
  category: Joi.string().min(3).max(50).required().messages({
    'string.base': 'La categoría debe ser texto.',
    'string.empty': 'La categoría no puede estar vacía.',
    'any.required': 'La categoría es un campo requerido.'
  }),
  stock: Joi.number().integer().min(0).default(0).messages({
    'number.base': 'El stock debe ser un número entero.',
    'number.min': 'El stock no puede ser negativo.'
  }),
  imageUrl: Joi.string().uri().allow(null, ''),
  active: Joi.boolean().default(true)
});

// Esquema para la actualización.
// Todos los campos son opcionales, pero al menos uno debe estar presente.
const updateProductSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  description: Joi.string().max(500),
  price: Joi.number().positive(),
  category: Joi.string().min(3).max(50),
  stock: Joi.number().integer().min(0),
  imageUrl: Joi.string().uri().allow(null, ''),
  active: Joi.boolean()
}).min(1).messages({ 'object.min': 'Debe proporcionar al menos un campo para actualizar.' });

// Esquema para validar los parámetros de búsqueda en la URL (query params)
const searchProductsSchema = Joi.object({
  q: Joi.string().min(2).max(50).trim().optional().messages({
    'string.min': 'El término de búsqueda debe tener al menos 2 caracteres.'
  }),
  category: Joi.string().pattern(/^[a-zA-Z,]+$/).optional().messages({
    'string.pattern.base': 'La categoría solo puede contener letras y comas (para búsquedas múltiples).'
  }),
  price_min: Joi.number().min(0).optional(),
  price_max: Joi.number().positive().optional(),
  sort_by: Joi.string().valid('price', 'createdAt', 'name').default('createdAt'),
  active: Joi.boolean().optional(),
  order: Joi.string().valid('asc', 'desc').default('desc'),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

module.exports = { createProductSchema, updateProductSchema, searchProductsSchema };