const productRepository = require('../repositories/product_repository');

class ProductService {
  async getAllProducts(filters = {}) {
    // Aquí podrías agregar lógica de negocio, como cacheo, etc.
    const { products, total } = await productRepository.getAll(filters);

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const totalPages = Math.ceil(total / limit);

    return {
      data: products,
      pagination: {
        totalItems: total,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    };
  }

  async getProductById(id) {
    return await productRepository.getById(id);
  }

  async createProduct(productData) {
    // Lógica de negocio: añadir timestamps y valores por defecto
    const now = new Date().toISOString();
    const newProductData = {
      ...productData,
      active: productData.active !== undefined ? productData.active : true,
      createdAt: now,
      updatedAt: now,
    };
    return await productRepository.create(newProductData);
  }

  async updateProduct(id, productData) {
    const existingProduct = await productRepository.getById(id);
    if (!existingProduct) {
      return null; // El controlador se encargará de la respuesta 404
    }

    // Si se está subiendo una nueva imagen (productData.imageUrl existe)
    // y el producto ya tenía una imagen antigua, eliminamos la antigua.
    if (productData.imageUrl && existingProduct.imageUrl) {
      await productRepository.deleteImage(existingProduct.imageUrl);
    }

    const dataToUpdate = { ...productData, updatedAt: new Date().toISOString() };
    delete dataToUpdate.createdAt; // Evitar que se sobreescriba la fecha de creación

    await productRepository.update(id, dataToUpdate);
    return { ...existingProduct, ...dataToUpdate };
  }

  async deleteProduct(id) {
    const existingProduct = await productRepository.getById(id);
    if (!existingProduct) {
      return null;
    }

    // Si el producto tiene una imagen, la eliminamos de Firebase Storage primero.
    if (existingProduct.imageUrl) {
      await productRepository.deleteImage(existingProduct.imageUrl);
    }

    await productRepository.delete(id);
    return { id }; // Confirma que la eliminación fue solicitada
  }
}

module.exports = new ProductService();
