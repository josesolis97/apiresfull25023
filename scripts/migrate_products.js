// Carga las variables de entorno desde el archivo .env en la raíz del proyecto.
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const db = require('../config/firebase');
const { products } = require('../data/products.json');

// Función para eliminar todos los documentos de una colección en lotes de 500.
async function deleteAllDocuments(collectionRef) {
  const snapshot = await collectionRef.limit(500).get();
  if (snapshot.size === 0) {
    return; // Termina la recursión cuando no hay más documentos.
  }

  const batch = db.batch();
  snapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Llama recursivamente para eliminar el siguiente lote.
  await deleteAllDocuments(collectionRef);
}

async function migrate() {
  if (!db) {
    console.error('❌ Error: No se pudo conectar a Firebase. Revisa tu configuración.');
    return;
  }

  console.log('Este script sincronizará los productos de `data/products.json` con tu colección de Firestore.');
  console.warn('\n⚠️  ADVERTENCIA: Esta operación es destructiva. Eliminará TODOS los productos existentes en la colección "products" antes de insertar los nuevos.\n');

  const { default: inquirer } = await import('inquirer');
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: '¿Estás seguro de que quieres continuar?',
      default: false,
    },
  ]);

  if (!confirm) {
    console.log('Operación cancelada por el usuario.');
    return;
  }

  try {
    const productsCollection = db.collection('products');

    console.log('\n🗑️  Eliminando productos existentes...');
    await deleteAllDocuments(productsCollection);
    console.log('✅ Productos existentes eliminados.');

    console.log('📦 Insertando nuevos productos...');
    const batch = db.batch();
    products.forEach(product => {
      const { id, ...productData } = product; // Firestore genera su propio ID.
      const newDocRef = productsCollection.doc();
      batch.set(newDocRef, { ...productData, price: Number(productData.price) });
    });
    await batch.commit();
    console.log(`\n✨ ¡Éxito! Se han insertado ${products.length} productos en Firestore.`);
  } catch (error) {
    console.error('\n🔥 Ocurrió un error durante la migración:', error);
  }
}

migrate();