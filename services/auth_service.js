const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user_repository');
const { AuthenticationError, ValidationError, NotFoundError } = require('../errors/custom_errors');

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

class AuthService {
  _generateTokenAndSanitizeUser(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    const { password, ...sanitizedUser } = user;
    return { user: sanitizedUser, token };
  }

  async register(userData) {
    const { email, password, name, role } = userData;

    // 1. Verificar si el usuario ya existe
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ValidationError('El correo electrónico ya está en uso.');
    }

    // 2. Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Crear el nuevo usuario
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role: role || 'user', // Permitir establecer el rol, por defecto 'user'
      createdAt: new Date().toISOString(),
    };
    const createdUser = await userRepository.create(newUser);

    // 4. Generar token y devolver datos limpios
    return this._generateTokenAndSanitizeUser(createdUser);
  }

  async login(email, password) {
    // 1. Buscar al usuario por email
    const user = await userRepository.findByEmail(email);

    // Verificamos si el usuario existe Y si tiene una contraseña guardada.
    // Si alguna de las dos falla, lanzamos el mismo error para no revelar información.
    if (!user || !user.password) {
      console.log(`Intento de login fallido para [${email}]: Usuario no encontrado o sin contraseña.`);
      throw new AuthenticationError('Credenciales inválidas.');
    }

    // 2. Comparar la contraseña proporcionada con la hasheada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Intento de login fallido para [${email}]: Contraseña incorrecta.`);
      throw new AuthenticationError('Credenciales inválidas.'); // Mismo mensaje genérico
    }

    // 3. Generar token y devolver datos limpios
    return this._generateTokenAndSanitizeUser(user);
  }

  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Usuario del token no encontrado en la base de datos.');
    }
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}

module.exports = new AuthService();