const express = require('express');
const router = express.Router();
const productController = require('../controllers/product_controller');
const { authenticate, isAdmin } = require('../middleware/auth_middleware');
const { validate, validateQuery } = require('../middleware/validation_middleware');
const { createProductSchema, updateProductSchema, searchProductsSchema } = require('../validators/product_validator');
const { upload, uploadToFirebase } = require('../middleware/upload_middleware');

// Ruta pública para obtener todos los productos
router.get('/', validateQuery(searchProductsSchema), productController.getAllProducts); // GET /api/products

// Ruta pública para obtener un producto por su ID
router.get('/:id', productController.getProductById); // GET /api/products/some-id

// Rutas protegidas que requieren autenticación y rol de administrador
router.post('/', authenticate, isAdmin, validate(createProductSchema), productController.createProduct);       // POST /api/products
router.put('/:id', authenticate, isAdmin, validate(updateProductSchema), productController.updateProduct);    // PUT /api/products/some-id
router.delete('/:id', authenticate, isAdmin, productController.deleteProduct); // DELETE /api/products/some-id

// Rutas con soporte para subida de imágenes
router.post('/upload', authenticate, isAdmin, upload.single('image'), uploadToFirebase, validate(createProductSchema), productController.createProduct);       // POST /api/products/upload
router.put('/upload/:id', authenticate, isAdmin, upload.single('image'), uploadToFirebase, validate(updateProductSchema), productController.updateProduct);    // PUT /api/products/upload/some-id

module.exports = router;