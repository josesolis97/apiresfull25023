// ===========================================
// 9. CONTROLLERS/AUTH_CONTROLLER.JS
// ===========================================

const authService = require('../services/auth_service');

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      
      res.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async profile(req, res, next) {
    try {
      // req.user.id viene del token decodificado en el middleware 'authenticate'
      const userProfile = await authService.getProfile(req.user.id);
      res.status(200).json({
        success: true,
        data: userProfile
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
