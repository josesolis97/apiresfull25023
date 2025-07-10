const multer = require('multer');
const { bucket } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

// Configuración de Multer para usar memoria (no guardar en disco)
const storage = multer.memoryStorage();

// Filtro para solo aceptar imágenes
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen'), false);
  }
};

// Configuración de Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  }
});

// Middleware para subir imagen a Firebase Storage
const uploadToFirebase = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(); // No hay archivo, continuar
    }

    if (!bucket) {
      return res.status(503).json({
        success: false,
        message: 'Firebase Storage no está configurado. Usa el método de URL externa.',
        hint: 'Habilita Firebase Storage en tu proyecto o usa el endpoint regular /api/products con imageUrl'
      });
    }

    // Verificar que el bucket existe
    const [bucketExists] = await bucket.exists();
    if (!bucketExists) {
      return res.status(503).json({
        success: false,
        message: 'El bucket de Firebase Storage no existe.',
        hint: 'Ve a Firebase Console > Storage > Comenzar para crear el bucket',
        bucketName: bucket.name
      });
    }

    // Generar nombre único para el archivo
    const fileName = `products/${uuidv4()}_${req.file.originalname}`;
    const file = bucket.file(fileName);

    // Crear stream para subir
    const blobStream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
      public: true, // Hacer público el archivo
    });

    blobStream.on('error', (error) => {
      console.error('Error subiendo archivo:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al subir la imagen',
        error: error.message
      });
    });

    blobStream.on('finish', async () => {
      // Obtener URL pública
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      
      // Añadir la URL al body de la request
      req.body.imageUrl = publicUrl;
      
      console.log(`Imagen subida exitosamente: ${publicUrl}`);
      next();
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    console.error('Error en uploadToFirebase:', error);
    return res.status(500).json({
      success: false,
      message: 'Error procesando la imagen',
      error: error.message
    });
  }
};

module.exports = {
  upload,
  uploadToFirebase
}; 