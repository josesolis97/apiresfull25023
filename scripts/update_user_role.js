// ===========================================
// SCRIPT PARA ACTUALIZAR ROL DE USUARIO
// ===========================================

// Cargar variables de entorno
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const { db } = require('../config/firebase');

async function updateUserRole() {
  if (!db) {
    console.error('❌ Error: No se pudo conectar a Firebase. Revisa tu configuración.');
    return;
  }

  const email = 'admin3@sistema.com'; // Usuario a actualizar
  const newRole = 'admin'; // Nuevo rol

  try {
    const usersCollection = db.collection('users');
    
    // Buscar usuario por email
    const snapshot = await usersCollection.where('email', '==', email).limit(1).get();
    
    if (snapshot.empty) {
      console.log(`❌ Usuario con email ${email} no encontrado.`);
      return;
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    
    console.log('📋 Usuario encontrado:');
    console.log(`ID: ${userDoc.id}`);
    console.log(`Nombre: ${userData.name}`);
    console.log(`Email: ${userData.email}`);
    console.log(`Rol actual: ${userData.role}`);
    
    // Actualizar rol
    await userDoc.ref.update({
      role: newRole,
      updatedAt: new Date().toISOString()
    });
    
    console.log(`\n✅ ¡Rol actualizado exitosamente!`);
    console.log(`Nuevo rol: ${newRole}`);
    
  } catch (error) {
    console.error('\n❌ Error al actualizar el rol:', error);
  }
}

// Ejecutar el script
updateUserRole().catch(console.error); 