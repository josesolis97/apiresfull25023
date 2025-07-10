
// ===========================================
// 3. MODELS/PRODUCT.JS
// ===========================================

const Joi = require('joi');

class Product {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.category = data.category;
    this.stock = data.stock;
    this.image = data.image;
    this.active = data.active !== undefined ? data.active : true;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  static validate(product) {
    const schema = Joi.object({
      name: Joi.string().min(3).max(100).required(),
      description: Joi.string().min(10).max(500).required(),
      price: Joi.number().positive().required(),
      category: Joi.string().min(3).max(50).required(),
      stock: Joi.number().integer().min(0).required(),
      image: Joi.string().uri().optional(),
      active: Joi.boolean().optional()
    });

    return schema.validate(product);
  }

  static validateUpdate(product) {
    const schema = Joi.object({
      name: Joi.string().min(3).max(100).optional(),
      description: Joi.string().min(10).max(500).optional(),
      price: Joi.number().positive().optional(),
      category: Joi.string().min(3).max(50).optional(),
      stock: Joi.number().integer().min(0).optional(),
      image: Joi.string().uri().optional(),
      active: Joi.boolean().optional()
    });

    return schema.validate(product);
  }
}

module.exports = Product;