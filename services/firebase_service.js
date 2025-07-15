// ===========================================
// 7. SERVICES/FIREBASE_SERVICE.JS
// ===========================================

const admin = require('firebase-admin');

class FirebaseService {
  constructor() {
    this.initialized = false;
    this.db = null;
  }

  initialize() {
    if (this.initialized) return;

    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      
      // Convertir las secuencias de escape \\n en saltos de línea reales
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });

      this.db = admin.firestore();
      this.initialized = true;
      console.log('Firebase inicializado correctamente');
    } catch (error) {
      console.error('Error al inicializar Firebase:', error);
      throw error;
    }
  }

  async getProducts(filters = {}) {
    this.initialize();
    
    try {
      let query = this.db.collection('products');
      
      if (filters.category) {
        query = query.where('category', '==', filters.category);
      }
      
      const snapshot = await query.get();
      const products = [];
      
      snapshot.forEach(doc => {
        products.push({ id: doc.id, ...doc.data() });
      });
      
      return products;
    } catch (error) {
      throw new Error(`Error al obtener productos de Firebase: ${error.message}`);
    }
  }

  async getProductById(id) {
    this.initialize();
    
    try {
      const doc = await this.db.collection('products').doc(id).get();
      
      if (!doc.exists) {
        throw new Error('Producto no encontrado');
      }
      
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      throw new Error(`Error al obtener producto de Firebase: ${error.message}`);
    }
  }

  async createProduct(product) {
    this.initialize();
    
    try {
      const docRef = await this.db.collection('products').add(product);
      return { id: docRef.id, ...product };
    } catch (error) {
      throw new Error(`Error al crear producto en Firebase: ${error.message}`);
    }
  }

  async updateProduct(id, updateData) {
    this.initialize();
    
    try {
      const docRef = this.db.collection('products').doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        throw new Error('Producto no encontrado');
      }
      
      const updatedData = {
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      await docRef.update(updatedData);
      return { id, ...doc.data(), ...updatedData };
    } catch (error) {
      throw new Error(`Error al actualizar producto en Firebase: ${error.message}`);
    }
  }
  async patchProduct(id, partialData) {
  this.initialize();

  try {
    const docRef = this.db.collection('products').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new Error('Producto no encontrado');
    }

    const patchData = {
      ...partialData,
      updatedAt: new Date().toISOString()
    };

    await docRef.update(patchData);

    const updatedDoc = await docRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
  } catch (error) {
    throw new Error(`Error al hacer patch del producto: ${error.message}`);
  }
}


  async deleteProduct(id) {
    this.initialize();
    
    try {
      const docRef = this.db.collection('products').doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        throw new Error('Producto no encontrado');
      }
      
      const productData = { id, ...doc.data() };
      await docRef.delete();
      
      return productData;
    } catch (error) {
      throw new Error(`Error al eliminar producto de Firebase: ${error.message}`);
    }
  }
}

module.exports = new FirebaseService();

