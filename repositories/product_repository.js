const { db, bucket } = require('../config/firebase');

class ProductRepository {
  constructor() {
    if (!db || !bucket) {
      console.warn('Firebase no está inicializado. El repositorio de productos no funcionará en modo offline.');
      this.collection = null;
      this.bucket = null;
    } else {
      this.collection = db.collection('products');
      this.bucket = bucket;
    }
  }

  async getAll(filters = {}) {
    if (!this.collection) {
      throw new Error('La conexión con Firebase no está disponible para obtener los productos.');
    }

    let query = this.collection;
    let countQuery = this.collection;

    // 1. Aplicar filtros de igualdad (son los más eficientes)
    if (filters.category) {
      // Comprobar si se buscan múltiples categorías (separadas por coma)
      if (filters.category.includes(',')) {
        const categories = filters.category.split(',');
        query = query.where('category', 'in', categories);
        countQuery = countQuery.where('category', 'in', categories);
      } else {
        query = query.where('category', '==', filters.category);
        countQuery = countQuery.where('category', '==', filters.category);
      }
    }

    // Aplicar filtro de estado (activo/inactivo)
    if (typeof filters.active === 'boolean') {
      query = query.where('active', '==', filters.active);
      countQuery = countQuery.where('active', '==', filters.active);
    }

    // 2. Aplicar filtro de rango (solo uno es posible por consulta en Firestore)
    // Se da prioridad al filtro de precio sobre la búsqueda por nombre.
    if (filters.price_min || filters.price_max) {
      if (filters.price_min) {
        query = query.where('price', '>=', Number(filters.price_min));
        countQuery = countQuery.where('price', '>=', Number(filters.price_min));
      }
      if (filters.price_max) {
        query = query.where('price', '<=', Number(filters.price_max));
        countQuery = countQuery.where('price', '<=', Number(filters.price_max));
      }
    } else if (filters.q) {
      // Búsqueda "empieza por" en el nombre. No se puede combinar con el filtro de precio.
      const searchTerm = filters.q;
      query = query.where('name', '>=', searchTerm).where('name', '<=', searchTerm + '\uf8ff');
      countQuery = countQuery.where('name', '>=', searchTerm).where('name', '<=', searchTerm + '\uf8ff');
    }

    // Obtener el conteo total de documentos que coinciden con el filtro.
    const totalSnapshot = await countQuery.count().get();
    const total = totalSnapshot.data().count;

    // 3. Aplicar ordenamiento.
    // NOTA: Firestore requiere que el primer 'orderBy' sea sobre el campo usado en un filtro de rango.
    const sortBy = filters.sort_by || 'createdAt';
    const order = filters.order || 'desc';
    query = query.orderBy(sortBy, order);

    // 4. Aplicar paginación
    const page = parseInt(filters.page, 10) || 1;
    const limit = parseInt(filters.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const snapshot = await query.limit(limit).offset(offset).get();
    if (snapshot.empty) {
      return { products: [], total };
    }
    const products = [];
    snapshot.forEach(doc => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return { products, total };
  }

  async getById(id) {
    if (!this.collection) {
      throw new Error('La conexión con Firebase no está disponible.');
    }
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() };
  }

  async create(productData) {
    if (!this.collection) {
      throw new Error('La conexión con Firebase no está disponible.');
    }
    const docRef = await this.collection.add(productData);
    const newDocSnapshot = await docRef.get();
    return { id: newDocSnapshot.id, ...newDocSnapshot.data() };
  }

  async update(id, productData) {
    if (!this.collection) {
      throw new Error('La conexión con Firebase no está disponible.');
    }
    await this.collection.doc(id).update(productData);
  }

  async delete(id) {
    if (!this.collection) {
      throw new Error('La conexión con Firebase no está disponible.');
    }
    await this.collection.doc(id).delete();
  }

  async deleteImage(imageUrl) {
    if (!this.bucket) {
      console.error('Firebase Storage no está disponible. No se puede eliminar la imagen.');
      return;
    }

    try {
      // Extraemos la ruta del archivo de la URL pública.
      // Ejemplo: https://storage.googleapis.com/bucket-name/products/image.jpg -> products/image.jpg
      const url = new URL(imageUrl);
      const filePath = decodeURIComponent(url.pathname.substring(this.bucket.name.length + 2));
      
      const file = this.bucket.file(filePath);
      await file.delete();
      console.log(`Imagen eliminada de Storage: ${filePath}`);
    } catch (error) {
      // Si el archivo no existe o hay otro error, lo registramos pero no detenemos la operación principal.
      console.error(`No se pudo eliminar la imagen ${imageUrl} de Storage:`, error.message);
    }
  }
}

module.exports = new ProductRepository();