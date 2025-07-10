// ===========================================
// SCRIPT PARA CREAR USUARIOS ADMINISTRADORES
// ===========================================

// Cargar variables de entorno
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const bcrypt = require('bcrypt');
const { db } = require('../config/firebase');

async function createAdmin() {
  if (!db) {
    console.error('❌ Error: No se pudo conectar a Firebase. Revisa tu configuración.');
    return;
  }

  console.log('🔧 Script para crear usuario administrador');
  console.log('=====================================\n');

  const { default: inquirer } = await import('inquirer');
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Nombre del administrador:',
      validate: (input) => input.length >= 2 || 'El nombre debe tener al menos 2 caracteres'
    },
    {
      type: 'input',
      name: 'email',
      message: 'Email del administrador:',
      validate: (input) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(input) || 'Debe ser un email válido';
      }
    },
    {
      type: 'password',
      name: 'password',
      message: 'Contraseña:',
      validate: (input) => input.length >= 6 || 'La contraseña debe tener al menos 6 caracteres'
    },
    {
      type: 'confirm',
      name: 'confirm',
      message: 'ConfirmarCreación del administrador?',
      default: false
    }
  ]);

  if (!answers.confirm) {
    console.log('Operación cancelada por el usuario.');
    return;
  }

  try {
    const usersCollection = db.collection('users');
    
    // Verificar si el usuario ya existe
    const existingUserSnapshot = await usersCollection.where('email', '==', answers.email).limit(1).get();
    
    if (!existingUserSnapshot.empty) {
      console.log('❌ Error: El correo electrónico ya está en uso.');
      return;
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(answers.password, saltRounds);

    // Crear el usuario administrador
    const adminUser = {
      name: answers.name,
      email: answers.email,
      password: hashedPassword,
      role: 'admin', // Rol de administrador
      createdAt: new Date().toISOString(),
    };

    const docRef = await usersCollection.add(adminUser);
    
    console.log('\n✅ ¡Usuario administrador creado exitosamente!');
    console.log(`ID: ${docRef.id}`);
    console.log(`Nombre: ${answers.name}`);
    console.log(`Email: ${answers.email}`);
    console.log(`Rol: admin`);
    console.log('\nYa puedes usar estas credenciales para login como administrador.');
    
  } catch (error) {
    console.error('\n❌ Error al crear el usuario administrador:', error);
  }
}

// Ejecutar el script
createAdmin().catch(console.error); 