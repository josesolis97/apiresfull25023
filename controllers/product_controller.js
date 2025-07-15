const productService = require('../services/product_service');
const { NotFoundError } = require('../errors/custom_errors');

class ProductController {
  async getAllProducts(req, res, next) {
    try {
      // Parsear parámetros de paginación desde la query, con valores por defecto.
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;

      // Pasa los query params (ej. ?category=deportes) y paginación al servicio
      const result = await productService.getAllProducts({ ...req.query, page, limit });
      
      if (result.data.length === 0) {
        result.message = 'No se encontraron productos para los criterios seleccionados.';
      }

      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error); // Pasa el error a nuestro manejador de errores central.
    }
  }

  async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);

      if (!product) {
        return next(new NotFoundError(`Producto con id '${id}' no encontrado.`));
      }

      res.status(200).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req, res, next) {
    try {
      const newProduct = await productService.createProduct(req.body);
      res.status(201).json({ success: true, message: 'Producto creado exitosamente.', data: newProduct });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const updatedProduct = await productService.updateProduct(id, req.body);

      if (!updatedProduct) {
        return next(new NotFoundError(`Producto con id '${id}' no encontrado para actualizar.`));
      }

      res.status(200).json({ success: true, message: 'Producto actualizado exitosamente.', data: updatedProduct });
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const result = await productService.deleteProduct(id);
      if (!result) return next(new NotFoundError(`Producto con id '${id}' no encontrado para eliminar.`));
      res.status(200).json({ success: true, message: `Producto con id '${id}' eliminado.` });
    } catch (error) {
      next(error);
    }
  }

  async patchProduct(req, res, next) {
    try {
      const { id } = req.params;
      const updatedProduct = await productService.updateProduct(id, req.body);

      if (!updatedProduct) {
        return next(new NotFoundError(`Producto con id '${id}' no encontrado para actualizar.`));
      }

      res.status(200).json({ success: true, message: 'Producto actualizado exitosamente.', data: updatedProduct });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new ProductController();
