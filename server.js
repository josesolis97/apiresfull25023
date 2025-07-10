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
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>API RESTful - Productos</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(to right, #e0eafc, #cfdef3);
          color: #333;
          padding: 2rem;
          line-height: 1.6;
        }
        h1 {
          font-size: 2.5rem;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }
        h2 {
          margin-top: 2rem;
          color: #34495e;
        }
        p, li {
          font-size: 1.1rem;
        }
        ul {
          list-style: none;
          padding-left: 1rem;
        }
        li {
          margin-bottom: 0.6rem;
        }
        a {
          color: #007BFF;
          text-decoration: none;
          transition: color 0.2s ease-in-out;
        }
        a:hover {
          color: #0056b3;
        }
        code {
          background: #f4f4f4;
          padding: 2px 5px;
          border-radius: 4px;
          font-family: monospace;
        }
        .footer {
          margin-top: 3rem;
          font-size: 0.9rem;
          color: #666;
        }
        .highlight {
          background: #dff0d8;
          border-left: 5px solid #3c763d;
          padding: 1rem;
          margin-top: 1rem;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <h1>📘 API RESTful de Productos</h1>
      <p>Bienvenido a la raíz de la API. Aquí encontrarás los principales endpoints para probar tu app.</p>

      <div class="highlight">
        <p><strong>Base URL:</strong> <code>https://apiresfull25023.vercel.app</code></p>
      </div>

      <h2>🔗 Endpoints públicos</h2>
      <ul>
        <li><a href="/api/products" target="_blank">Listar todos los productos</a></li>
        <li><a href="/api/products?q=Balón" target="_blank">Buscar por nombre (ej: Balón)</a></li>
        <li><a href="/api/products?category=futbol" target="_blank">Filtrar por categoría (futbol)</a></li>
        <li><a href="/api/products?price_min=50000" target="_blank">Filtrar por precio mínimo</a></li>
        <li><a href="/api/products?price_max=100000" target="_blank">Filtrar por precio máximo</a></li>
        <li><a href="/api/products?price_min=50000&price_max=200000" target="_blank">Rango de precio</a></li>
        <li><a href="/api/products?active=true" target="_blank">Solo productos activos</a></li>
        <li><a href="/api/products?sort_by=price&order=asc" target="_blank">Ordenar por precio (ascendente)</a></li>
        <li><a href="/api/products?page=2&limit=5" target="_blank">Paginación (página 2)</a></li>
        <li><a href="/api/products?category=baloncesto,futbol&price_min=80000&active=true&sort_by=price&order=desc&page=1&limit=10" target="_blank">Búsqueda compleja</a></li>
      </ul>

      <h2>🔐 Endpoints protegidos (requieren token)</h2>
      <ul>
        <li><code>POST /api/auth/login</code></li>
        <li><code>POST /api/auth/register</code></li>
        <li><code>GET /api/auth/profile</code></li>
      </ul>

      <h2>⚠️ Reglas importantes</h2>
      <ul>
        <li>No usar <code>?q</code> junto con filtros de precio (<code>price_min</code>, <code>price_max</code>).</li>
        <li>Si se combinan, el sistema prioriza el filtro de precios.</li>
      </ul>

      <div class="footer">
        <p>Versión: ${process.env.VERSION || '1.0.0'} | Ambiente: ${process.env.NODE_ENV || 'development'}</p>
        <p>Fecha: ${new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}</p>
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
