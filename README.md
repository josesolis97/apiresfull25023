# API de Tienda E-commerce con Node.js y Firebase

Esta es una API RESTful robusta y escalable para una tienda de e-commerce, construida con Node.js, Express y Firebase (Firestore). Sigue una arquitectura de 3 capas (Controlador, Servicio, Repositorio) para una clara separación de responsabilidades y fácil mantenimiento.

## 📋 Tabla de Contenidos

- [✨ Características Principales](#-características-principales)
- [🛠️ Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [📋 Prerrequisitos](#-prerrequisitos)
- [🚀 Instalación y Configuración](#-instalación-y-configuración)
- [▶️ Ejecutando la Aplicación](#️-ejecutando-la-aplicación)
- [👥 Usuarios de Prueba](#-usuarios-de-prueba)
- [🔍 Guía Completa de Búsquedas](#-guía-completa-de-búsquedas)
- [📚 Documentación de la API](#-documentación-de-la-api)
  - [🔐 Sistema de Roles y Permisos](#-sistema-de-roles-y-permisos)
  - [🛡️ Middlewares de Autenticación](#️-middlewares-de-autenticación)
  - [📋 Endpoints por Rol](#-endpoints-por-rol)
  - [🔑 Uso de Tokens](#-uso-de-tokens)
- [📂 Estructura del Proyecto](#-estructura-del-proyecto)
- [🚀 Ejemplos Prácticos con Postman](#-ejemplos-prácticos-con-postman)
- [📞 Contacto](#-contacto)

## ✨ Características Principales

-   **Autenticación JWT**: Endpoints seguros para registro y login de usuarios con JSON Web Tokens.
-   **Gestión de Productos (CRUD)**: Operaciones completas para Crear, Leer, Actualizar y Eliminar productos.
-   **Buscador Avanzado**: Un potente endpoint de búsqueda que permite:
    -   Filtrar por categoría (única o múltiple).
    -   Filtrar por rango de precios (`price_min`, `price_max`).
    -   Búsqueda por texto en el nombre del producto.
-   **Ordenamiento Dinámico**: Ordena los resultados por nombre, precio o fecha de creación.
-   **Paginación**: Manejo eficiente de grandes conjuntos de datos con paginación (`page`, `limit`).
-   **Validación de Datos**: Uso de `Joi` para validar todas las entradas de la API, asegurando la integridad de los datos.
-   **Manejo de Errores Centralizado**: Un middleware que captura todos los errores, los registra en Firestore y envía respuestas consistentes.
-   **Seguridad**: Configuración básica de seguridad con `helmet` y limitación de peticiones (rate-limiting).
-   **Script de Migración**: Un script para poblar/sincronizar la base de datos de Firestore desde un archivo JSON local.

## 🛠️ Tecnologías Utilizadas

-   **Backend**: Node.js, Express.js
-   **Base de Datos**: Google Firestore
-   **Autenticación**: JSON Web Token (JWT)
-   **Validación**: Joi
-   **Seguridad**: Helmet, express-rate-limit
-   **Variables de Entorno**: dotenv

## 📋 Prerrequisitos

-   Node.js (v18 o superior)
-   npm o yarn
-   Una cuenta de Google y un proyecto de Firebase creado.

## 🚀 Instalación y Configuración

Sigue estos pasos para poner en marcha el proyecto en tu máquina local.

**1. Clona el repositorio:**
```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>
```

**2. Instala las dependencias:**
```bash
npm install
```

**3. Configura Firebase:**
-   Ve a la Consola de Firebase y selecciona tu proyecto.
-   Ve a **Configuración del proyecto** > **Cuentas de servicio**.
-   Haz clic en **"Generar nueva clave privada"**. Esto descargará un archivo JSON.
-   Renombra este archivo a `firebase-service-account.json` y muévelo a la raíz de tu proyecto.

**4. Configura las variables de entorno:**
-   Crea un archivo llamado `.env` en la raíz del proyecto.
-   Usa la siguiente plantilla:

```env
# Configuración del Servidor
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173 # Orígenes permitidos para CORS (ej. tu frontend)

# Clave secreta para JWT
JWT_SECRET=TU_CLAVE_SECRETA_SUPER_SEGURA

# Habilitar Firebase
USE_FIREBASE=true

# Rate Limiting (opcional)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## ▶️ Ejecutando la Aplicación

**1. Iniciar el servidor:**
Para iniciar el servidor en modo de desarrollo con recarga automática (usando `nodemon`):
```bash
npm run dev
```
O para iniciar en modo de producción:
```bash
npm start
```
El servidor estará corriendo en `http://localhost:3000`.

**2. Poblar la base de datos (Opcional):**
Para llenar tu base de datos de Firestore con los datos de ejemplo de `data/products.json`, ejecuta el script de migración. **¡Cuidado! Esto borrará todos los productos existentes.**
```bash
node scripts/migrate_products.js
```

## 👥 Usuarios de Prueba

Para facilitar las pruebas de la API, se han creado los siguientes usuarios de ejemplo:

### **Usuario Normal** 👤
- **Email:** `soliscabrerajose7@gmail.com`
- **Contraseña:** `123456`
- **Rol:** `user`
- **Permisos:**
  - ✅ Registrarse e iniciar sesión
  - ✅ Ver todos los productos (búsqueda, filtros, paginación)
  - ✅ Ver detalles de un producto específico
  - ✅ Acceder a su perfil
  - ❌ No puede crear, editar o eliminar productos

### **Administrador** 🔧
- **Email:** `admin3@sistema.com`
- **Contraseña:** `admin123`
- **Rol:** `admin`
- **Permisos:**
  - ✅ Todas las funcionalidades de usuario normal
  - ✅ **Crear** nuevos productos
  - ✅ **Editar** productos existentes
  - ✅ **Eliminar** productos
  - ✅ Acceso completo a la gestión de productos

### **Crear Nuevos Usuarios**

**Para Usuario Normal:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@ejemplo.com","password":"123456","name":"Nombre Usuario"}'
```

**Para Usuario Administrador:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ejemplo.com","password":"admin123","name":"Administrador","role":"admin"}'
```

## 🔍 Guía Completa de Búsquedas

### **Búsquedas Básicas**

1. **Listar todos los productos:**
   ```
   GET /api/products
   ```

2. **Buscar por nombre:**
   ```
   GET /api/products?q=Balón
   ```

3. **Filtrar por categoría:**
   ```
   GET /api/products?category=futbol
   ```

4. **Filtrar por múltiples categorías:**
   ```
   GET /api/products?category=futbol,baloncesto
   ```

### **Búsquedas por Precio**

1. **Productos con precio mínimo:**
   ```
   GET /api/products?price_min=50000
   ```

2. **Productos con precio máximo:**
   ```
   GET /api/products?price_max=100000
   ```

3. **Productos en rango de precio:**
   ```
   GET /api/products?price_min=50000&price_max=200000
   ```

### **Filtros de Estado**

1. **Solo productos activos:**
   ```
   GET /api/products?active=true
   ```

2. **Solo productos inactivos:**
   ```
   GET /api/products?active=false
   ```

### **Ordenamiento**

1. **Ordenar por precio (menor a mayor):**
   ```
   GET /api/products?sort_by=price&order=asc
   ```

2. **Ordenar por nombre (A-Z):**
   ```
   GET /api/products?sort_by=name&order=asc
   ```

3. **Ordenar por fecha de creación (más recientes primero):**
   ```
   GET /api/products?sort_by=createdAt&order=desc
   ```

### **Paginación**

1. **Segunda página con 5 productos por página:**
   ```
   GET /api/products?page=2&limit=5
   ```

2. **Obtener 20 productos por página:**
   ```
   GET /api/products?limit=20
   ```

### **Búsquedas Combinadas**

1. **Productos de fútbol baratos, ordenados por precio:**
   ```
   GET /api/products?category=futbol&price_max=100000&sort_by=price&order=asc
   ```

2. **Búsqueda compleja con paginación:**
   ```
   GET /api/products?category=baloncesto,futbol&price_min=80000&active=true&sort_by=price&order=desc&page=1&limit=10
   ```

3. **Productos más caros en múltiples categorías:**
   ```
   GET /api/products?category=futbol,accesorios&sort_by=price&order=desc&page=2&limit=5
   ```

### **⚠️ Limitaciones Importantes**

- **Firestore Limitation:** No puedes usar filtro de texto (`q`) junto con filtros de rango de precio (`price_min`/`price_max`) al mismo tiempo.
- **Prioridad:** Si especificas tanto `q` como `price_min`/`price_max`, se ignorará el filtro de texto.

### **Categorías Disponibles**
- `futbol`
- `baloncesto` 
- `indumentaria`
- `accesorios`
- `prueba` (para productos de testing)

## 📚 Documentación de la API

### Autenticación (`/api/auth`)

-   **`POST /login`**: Inicia sesión.
-   **`POST /register`**: Registra un nuevo usuario.
-   **`GET /profile`**: Obtiene el perfil del usuario autenticado (requiere token).

#### **🔐 Sistema de Roles y Permisos**

La API maneja dos tipos de roles:

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| `user` | Usuario normal (rol por defecto) | • Login/Registro<br>• Ver productos<br>• Búsquedas y filtros<br>• Ver perfil |
| `admin` | Administrador del sistema | • Todos los permisos de `user`<br>• **Crear** productos<br>• **Editar** productos<br>• **Eliminar** productos |

#### **🛡️ Middlewares de Autenticación**

1. **`authenticate`**: Valida el token JWT
2. **`isAdmin`**: Requiere rol de administrador

#### **📋 Endpoints por Rol**

**Públicos (sin autenticación):**
```
POST /api/auth/login      # Login
POST /api/auth/register   # Registro
GET  /api/products        # Listar productos
GET  /api/products/:id    # Ver producto específico
```

**Autenticados (requiere token):**
```
GET  /api/auth/profile    # Ver perfil propio
```

**Solo Administradores (requiere token + rol admin):**
```
POST   /api/products      # Crear producto
PUT    /api/products/:id  # Actualizar producto
DELETE /api/products/:id  # Eliminar producto
```

#### **🔑 Uso de Tokens**

Para endpoints protegidos, incluye el token en el header:
```bash
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Ejemplo de uso en Postman:**
1. Haz login y copia el `token` de la respuesta
2. En Headers agrega: `Authorization: Bearer [token_copiado]`
3. Ya puedes acceder a endpoints protegidos

### Productos (`/api/products`)

#### `GET /` - Búsqueda Avanzada de Productos

Este es el endpoint principal para buscar y filtrar productos. Puedes combinar cualquiera de los siguientes parámetros para refinar tu búsqueda.

**Parámetros de Búsqueda y Filtrado:**

| Parámetro   | Tipo      | Descripción                                                                                             | Ejemplo de Uso                                       |
| :---------- | :-------- | :------------------------------------------------------------------------------------------------------ | :--------------------------------------------------- |
| `q`         | `string`  | **Búsqueda por nombre.** Busca productos cuyo nombre *comience por* el texto proporcionado.              | `?q=Balon`                                           |
| `category`  | `string`  | **Filtrar por categoría.** Acepta una o múltiples categorías separadas por comas.                         | `?category=futbol` o `?category=futbol,indumentaria` |
| `price_min` | `number`  | **Precio mínimo.** Productos con un precio mayor o igual al valor.                                       | `?price_min=100000`                                  |
| `price_max` | `number`  | **Precio máximo.** Productos con un precio menor o igual al valor.                                       | `?price_max=90000`                                   |
| `active`    | `boolean` | **Filtrar por estado.** Devuelve productos activos (`true`) o inactivos (`false`).                        | `?active=true`                                       |

> **⚠️ Nota Importante sobre Filtros:** Debido a una limitación de Firestore, no puedes usar un filtro de rango (como `price_min` o `q`) en más de un campo a la vez. Este sistema da prioridad al filtro de precio. **Si usas `price_min` o `price_max`, el filtro `q` (nombre) será ignorado.**

**Parámetros de Ordenamiento:**

| Parámetro | Tipo     | Descripción                                    | Valores Posibles                     | Ejemplo de Uso      |
| :-------- | :------- | :--------------------------------------------- | :----------------------------------- | :------------------ |
| `sort_by` | `string` | Campo por el cual se ordenarán los resultados. | `createdAt` (defecto), `price`, `name` | `?sort_by=price`    |
| `order`   | `string` | Dirección del orden.                           | `desc` (defecto), `asc`              | `?order=asc`        |

**Parámetros de Paginación:**

| Parámetro | Tipo     | Descripción                       | Valor por Defecto | Ejemplo de Uso |
| :-------- | :------- | :-------------------------------- | :---------------- | :------------- |
| `page`    | `number` | Número de página que deseas ver.  | `1`               | `?page=2`      |
| `limit`   | `number` | Cantidad de productos por página. | `10`              | `?limit=5`     |

**Ejemplos de Peticiones Complejas:**

-   **Buscar productos de la categoría "baloncesto" que cuesten menos de 200,000, ordenados por precio de forma ascendente:**
    `GET /api/products?category=baloncesto&price_max=200000&sort_by=price&order=asc`

-   **Buscar productos activos cuyo nombre empiece por "Camiseta":**
    `GET /api/products?q=Camiseta&active=true`

-   **Ver la segunda página de los productos más caros de la tienda en las categorías "futbol" o "accesorios":**
    `GET /api/products?category=futbol,accesorios&sort_by=price&order=desc&page=2&limit=5`

#### Otros Endpoints de Productos

-   **`GET /:id`**: Obtiene un producto específico por su ID.
-   **`POST /`**: Crea un nuevo producto. (Requiere autenticación y rol de administrador).
-   **`PUT /:id`**: Actualiza un producto existente. (Requiere autenticación y rol de administrador).
-   **`DELETE /:id`**: Elimina un producto. (Requiere autenticación y rol de administrador).

## 📸 Sistema de Manejo de Imágenes

La API maneja las imágenes de productos de dos maneras:

### **1. Por URL (Método Actual)**
Puedes proporcionar una URL externa de la imagen:

```json
{
  "name": "Producto con URL",
  "description": "Producto con imagen externa",
  "price": 50000,
  "category": "futbol",
  "stock": 10,
  "imageUrl": "https://example.com/imagen.jpg"
}
```

### **2. Subida de Archivos (Nuevo)**
Puedes subir archivos directamente usando los endpoints especializados:

#### **Crear Producto con Imagen**
```bash
POST /api/products/upload
Content-Type: multipart/form-data
Authorization: Bearer [TOKEN_DE_ADMIN]

# Campos del formulario:
name=Producto con Imagen Subida
description=Producto con imagen subida directamente
price=75000
category=futbol
stock=15
image=[ARCHIVO_DE_IMAGEN]
```

#### **Actualizar Producto con Nueva Imagen**
```bash
PUT /api/products/upload/c9SZAAHcyZeSqwpEhZoL
Content-Type: multipart/form-data
Authorization: Bearer [TOKEN_DE_ADMIN]

# Campos del formulario:
name=Producto Actualizado
image=[NUEVO_ARCHIVO_DE_IMAGEN]
```

### **⚠️ Importante sobre Imágenes**

- **Formatos soportados**: JPG, PNG, GIF, WebP
- **Tamaño máximo**: 5MB por imagen
- **Almacenamiento**: Firebase Storage (público)
- **Eliminación automática**: Al cambiar o eliminar producto, la imagen anterior se elimina automáticamente
- **URLs generadas**: `https://storage.googleapis.com/[bucket]/products/[uuid]_[filename]`

### **🔧 Configuración de Firebase Storage**

Para usar la **subida de archivos**, necesitas habilitar Firebase Storage:

1. **Ve a [Firebase Console](https://console.firebase.google.com/)**
2. **Selecciona tu proyecto** (cursojs-c9f67)
3. **En el menú lateral, busca "Storage"**
4. **Haz clic en "Comenzar"**
5. **Acepta las reglas de seguridad por defecto**
6. **Selecciona una ubicación** (ej: `us-central1`)

**Si Firebase Storage NO está configurado:**
- ✅ El método de **URL externa** sigue funcionando
- ❌ El método de **subida de archivos** dará error 503

### **Uso en Postman**

**Para subir archivos en Postman:**
1. Selecciona el método POST o PUT
2. En Body, selecciona "form-data"
3. Añade los campos de texto normalmente
4. Para el campo "image", cambia el tipo a "File" y selecciona tu imagen
5. Agrega el header Authorization con tu token de admin

## 📂 Estructura del Proyecto

El proyecto sigue una arquitectura de capas para mantener el código organizado y escalable:

```
/
├── config/             # Configuración (Firebase)
├── controllers/        # Manejan las peticiones HTTP y las respuestas
├── data/               # Datos estáticos (ej. products.json)
├── middleware/         # Middlewares de Express (auth, errores, etc.)
├── models/             # (Obsoleto) Clases de modelo de datos
├── repositories/       # Capa de acceso a datos (interactúa con Firestore)
├── routes/             # Definición de las rutas de la API
├── scripts/            # Scripts de utilidad (ej. migración)
├── services/           # Lógica de negocio de la aplicación
├── validators/         # Esquemas de validación con Joi
├── .env                # Variables de entorno (ignorado por Git)
├── .gitignore          # Archivos ignorados por Git
├── firebase-service-account.json # Clave de servicio de Firebase (ignorado por Git)
├── package.json
└── server.js           # Punto de entrada de la aplicación
```

## 🚀 Ejemplos Prácticos con Postman

### **1. Login como Usuario Normal**

**Request:**
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "soliscabrerajose7@gmail.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": "42Psymr2JuWN7K8Hy43G",
      "name": "José Solis Cabrera",
      "email": "soliscabrerajose7@gmail.com",
      "role": "user",
      "createdAt": "2025-07-09T14:49:42.292Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### **2. Login como Administrador**

**Request:**
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin3@sistema.com",
  "password": "admin123"
}
```

### **3. Crear Producto (Solo Admin)**

**Request:**
```bash
POST http://localhost:3000/api/products
Content-Type: application/json
Authorization: Bearer [TOKEN_DE_ADMIN]

{
  "name": "Producto de Prueba Admin",
  "description": "Este producto fue creado por un administrador",
  "price": 50000,
  "category": "prueba",
  "stock": 10
}
```

**Response exitosa:**
```json
{
  "success": true,
  "message": "Producto creado exitosamente.",
  "data": {
    "id": "c9SZAAHcyZeSqwpEhZoL",
    "name": "Producto de Prueba Admin",
    "description": "Este producto fue creado por un administrador",
    "price": 50000,
    "category": "prueba",
    "stock": 10,
    "active": true,
    "createdAt": "2025-07-09T15:02:18.510Z",
    "updatedAt": "2025-07-09T15:02:18.510Z"
  }
}
```

### **4. Intentar Crear Producto con Usuario Normal**

**Request:**
```bash
POST http://localhost:3000/api/products
Content-Type: application/json
Authorization: Bearer [TOKEN_DE_USER]

{
  "name": "Intento de Usuario Normal",
  "description": "Este request debería fallar",
  "price": 25000,
  "category": "test",
  "stock": 5
}
```

**Response de error (403 Forbidden):**
```json
{
  "success": false,
  "message": "Acceso denegado. Se requieren privilegios de administrador.",
  "error": "AuthenticationError"
}
```

### **5. Búsquedas de Productos (Públicas)**

**Búsqueda básica:**
```bash
GET http://localhost:3000/api/products
```

**Búsqueda con filtros:**
```bash
GET http://localhost:3000/api/products?category=futbol&price_max=100000&sort_by=price&order=asc
```

**Búsqueda con paginación:**
```bash
GET http://localhost:3000/api/products?page=2&limit=5
```

### **6. Ver Perfil de Usuario**

**Request:**
```bash
GET http://localhost:3000/api/auth/profile
Authorization: Bearer [TOKEN_DE_USUARIO]
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "42Psymr2JuWN7K8Hy43G",
    "name": "José Solis Cabrera",
    "email": "soliscabrerajose7@gmail.com",
    "role": "user",
    "createdAt": "2025-07-09T14:49:42.292Z"
  }
}
```

---

## 📞 Contacto

**Desarrollado por:** José Antonio Solis  
**Email:** [josesolis97@gmail.com](mailto:josesolis97@gmail.com)  
**Proyecto:** API RESTful de E-commerce con Node.js y Firebase# apiresfull25023
