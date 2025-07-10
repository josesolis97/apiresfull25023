// ===========================================
// 2. SERVER.JS (PUNTO DE ENTRADA)
// ===========================================

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
require('./config/firebase');


const productRoutes = require('./routes/product_routes');
const authRoutes = require('./routes/auth_routes');
const errorHandler = require('./middleware/error_handler');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de seguridad
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: 'Demasiadas solicitudes desde esta IP, intenta más tarde.'
});
app.use(limiter);

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

//Inicio de Raiz
app.use(express.static('public')); // Esto sirve los archivos estáticos como favicon, imágenes, etc.

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>API RESTful - Productos</title>

      <!-- 🌐 Favicon -->
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />

      <!-- 🔗 Meta para compartir -->
      <meta property="og:title" content="Examen - API RESTful de Productos" />
      <meta property="og:description" content="Examen de API RESTful de Productos de Jose Antonio Solis" />
      <meta property="og:image" content="https://apiresfull25023.vercel.app/api-preview.png" />
      <meta property="og:url" content="https://apiresfull25023.vercel.app/" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Segoe UI', sans-serif;
          background: linear-gradient(to right, #e0eafc, #cfdef3);
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 2rem;
        }
        .container {
          background: white;
          max-width: 900px;
          width: 100%;
          padding: 2rem 3rem;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        h1 {
          text-align: center;
          color: #2c3e50;
          margin-bottom: 1rem;
        }
        h2 {
          color: #34495e;
          margin-top: 1.5rem;
        }
        ul {
          list-style: none;
          padding-left: 0;
          margin-top: 0.5rem;
        }
        li {
          margin-bottom: 0.6rem;
        }
        a {
          color: #007BFF;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
        code {
          background: #f1f1f1;
          padding: 2px 5px;
          border-radius: 4px;
        }
        .highlight {
          background: #dff0d8;
          border-left: 5px solid #3c763d;
          padding: 1rem;
          border-radius: 5px;
          margin-bottom: 1rem;
        }
        .footer {
          margin-top: 2rem;
          text-align: center;
          font-size: 0.95rem;
          color: #666;
        }
        .footer a {
          color: #28a745;
          text-decoration: none;
        }
        .footer a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>📘 API RESTful de Productos</h1>
        <p style="text-align: center;">Bienvenido a la documentación inicial de esta API. Abajo encontrarás rutas útiles para probarla.</p>

        <div class="highlight">
          <p><strong>Base URL:</strong> <code>https://apiresfull25023.vercel.app</code></p>
        </div>

        <h2>🔗 Endpoints públicos</h2>
        <ul>
          <li><a href="/api/products" target="_blank">Listar todos los productos</a></li>
          <li><a href="/api/products?q=Balón" target="_blank">Buscar por nombre</a></li>
          <li><a href="/api/products?category=futbol" target="_blank">Filtrar por categoría</a></li>
          <li><a href="/api/products?price_min=50000" target="_blank">Precio mínimo</a></li>
          <li><a href="/api/products?price_max=100000" target="_blank">Precio máximo</a></li>
          <li><a href="/api/products?price_min=50000&price_max=200000" target="_blank">Rango de precios</a></li>
          <li><a href="/api/products?active=true" target="_blank">Solo productos activos</a></li>
          <li><a href="/api/products?sort_by=price&order=asc" target="_blank">Ordenar por precio</a></li>
          <li><a href="/api/products?page=2&limit=5" target="_blank">Paginación</a></li>
          <li><a href="/api/products?category=baloncesto,futbol&price_min=80000&active=true&sort_by=price&order=desc&page=1&limit=10" target="_blank">Búsqueda compleja</a></li>
        </ul>

        <h2>🔐 Autenticación</h2>
        <ul>
          <li><code>POST /api/auth/login</code></li>
          <li><code>POST /api/auth/register</code></li>
          <li><code>GET /api/auth/profile</code> (requiere token)</li>
        </ul>

        <h2>⚠️ Reglas importantes</h2>
        <ul>
          <li>No usar <code>?q</code> junto con filtros de precio.</li>
          <li>Se priorizan los filtros de precio.</li>
        </ul>

        <div class="footer">
          <p>Versión: ${process.env.VERSION || '1.0.0'} | Entorno: ${process.env.NODE_ENV || 'development'}</p>
          <p>Fecha: ${new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}</p>
          <p>Desarrollado por <strong>Jose Antonio Solis Cabrera</strong></p>
          <p>Email: <a href="mailto:josesolis97@gmail.com">josesolis97@gmail.com</a></p>
          <p>WhatsApp: <a href="https://wa.me/5491156511894" target="_blank">+54 9 11 5651-1894</a></p>
        </div>
      </div>
    </body>
    </html>
  `);
});



// Ruta de salud
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Curso NODEJS Avanzado',
    version: process.env.VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Middleware de manejo de errores
app.use(errorHandler);

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe`
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Documentación disponible en: http://localhost:${PORT}/health`);
});
