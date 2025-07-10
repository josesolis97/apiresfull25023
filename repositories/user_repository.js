const { db } = require('../config/firebase');

class UserRepository {
  constructor() {
    if (!db) {
      console.warn('Firebase no está inicializado. El repositorio de usuarios no funcionará.');
      this.collection = null;
    } else {
      this.collection = db.collection('users');
    }
  }

  async findByEmail(email) {
    if (!this.collection) throw new Error('La conexión con Firebase no está disponible.');
    
    const snapshot = await this.collection.where('email', '==', email).limit(1).get();
    if (snapshot.empty) {
      return null;
    }
    const userDoc = snapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() };
  }

  async create(userData) {
    if (!this.collection) throw new Error('La conexión con Firebase no está disponible.');

    const docRef = await this.collection.add(userData);
    return { id: docRef.id, ...userData };
  }

  async findById(id) {
    if (!this.collection) throw new Error('La conexión con Firebase no está disponible.');
    
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() };
  }
}

module.exports = new UserRepository();