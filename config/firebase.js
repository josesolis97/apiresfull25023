const admin = require('firebase-admin');
const path = require('path');

// Comprueba si se debe usar Firebase desde las variables de entorno
const useFirebase = process.env.USE_FIREBASE === 'true';

let db;
let bucket;

if (useFirebase) {
  try {
    let serviceAccount;
    let projectId;

    // Prioridad 1: Usar variable de entorno con el JSON de la cuenta de servicio
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        
        // Convertir las secuencias de escape \\n en saltos de línea reales
        if (serviceAccount.private_key) {
          serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        }
        
        projectId = serviceAccount.project_id;
        console.log('Cargando credenciales de Firebase desde la variable de entorno FIREBASE_SERVICE_ACCOUNT.');
      } catch (e) {
        console.error('🔥 ERROR: La variable de entorno FIREBASE_SERVICE_ACCOUNT no contiene un JSON válido.');
        throw e; // Relanzar el error para que sea capturado por el catch principal
      }
    } else {
      // Prioridad 2: Cargar credenciales desde el archivo JSON en la raíz del proyecto (fallback)
      console.log('Buscando credenciales de Firebase en el archivo "firebase-service-account.json"...');
      const serviceAccountPath = path.resolve(process.cwd(), './firebase-service-account.json');
      serviceAccount = require(serviceAccountPath);
      projectId = serviceAccount.project_id;
    }

    // Solo inicializa si no hay otras apps de Firebase inicializadas
    // Esto previene errores durante el hot-reloading en desarrollo.
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL || `https://${projectId}.firebaseio.com`,
        storageBucket: `${projectId}.appspot.com`
      });
    }

    // Obtiene la instancia de Firestore
    db = admin.firestore();
    // Obtiene la instancia del bucket de Storage
    bucket = admin.storage().bucket();
    console.log(`Conexión con Firebase Firestore establecida para el proyecto: ${projectId}`);
    console.log(`Conexión con Firebase Storage establecida para el bucket: ${bucket.name}`);
  } catch (error) {
    console.error('======================================================================');
    console.error('🔥 ERROR GRAVE AL INICIALIZAR FIREBASE ADMIN SDK 🔥');
    if (error.code === 'MODULE_NOT_FOUND') {
      console.error('Asegúrate de que el archivo "firebase-service-account.json" existe en la raíz del proyecto o configura la variable de entorno FIREBASE_SERVICE_ACCOUNT.');
    } else {
      console.error('Verifica que el contenido de las credenciales (archivo o variable de entorno) es un JSON válido.');
    }
    console.error('Error Original:', error.message);
    console.error('======================================================================');
    // Si falla, db no se inicializa y el errorHandler capturará el error al intentar usarlo.
  }
} else {
  console.log('Firebase está deshabilitado. La aplicación se ejecutará en modo offline.');
}

module.exports = { db, bucket };