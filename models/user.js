// ===========================================
// 4. MODELS/USER.JS
// ===========================================

const Joi = require('joi');

class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role || 'user';
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  static validate(user) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      role: Joi.string().valid('admin', 'user').optional()
    });

    return schema.validate(user);
  }
}

module.exports = User;