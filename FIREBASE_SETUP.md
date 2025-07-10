# 🔥 Guía para Activar Firebase

## 📋 Estado Actual
- ✅ **Firebase Admin SDK instalado** (`firebase-admin`)
- ✅ **Configuración implementada** en `config/firebase.js`
- ✅ **Servicio de Firebase** en `services/firebase_service.js`
- ❌ **Firebase desactivado** - necesita configuración

## 🚀 Pasos para Activar Firebase

### 1. Crear archivo `.env`
Crea un archivo `.env` en la raíz del proyecto con este contenido:

```env
# Configuración del Servidor
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Clave secreta para JWT
JWT_SECRET=TU_CLAVE_SECRETA_SUPER_SEGURA_CAMBIA_ESTO

# 🔥 ACTIVAR FIREBASE
USE_FIREBASE=true

# Rate Limiting (opcional)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2. Configurar Credenciales de Firebase

Tienes **dos opciones** para las credenciales:

#### Opción A: Archivo JSON (Recomendado)
1. Ve a la [Consola de Firebase](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Configuración del proyecto** > **Cuentas de servicio**
4. Haz clic en **"Generar nueva clave privada"**
5. Descarga el archivo JSON y renómbralo a `firebase-service-account.json`
6. Mueve el archivo a la raíz del proyecto

#### Opción B: Variables de Entorno
Si prefieres usar variables de entorno, agrega esto a tu `.env`:

```env
# Credenciales de Firebase como JSON string
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"tu-project-id","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}

# URL de la base de datos
FIREBASE_DATABASE_URL=https://tu-project-id.firebaseio.com
```

### 3. Iniciar el Servidor
```bash
npm run dev
```

### 4. Poblar la Base de Datos (Opcional)
Para cargar datos de ejemplo:
```bash
node scripts/migrate_products.js
```

## 🔍 Verificar Activación

Si Firebase está activado correctamente, verás en la consola:
```
Conexión con Firebase Firestore establecida para el proyecto: tu-project-id
Conexión con Firebase Storage establecida para el bucket: tu-project-id.appspot.com
```

Si hay errores, verás mensajes detallados sobre qué configurar.

## 📚 Endpoints Disponibles

Una vez activado Firebase, estos endpoints estarán disponibles:

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Obtener producto por ID
- `POST /api/products` - Crear producto (admin)
- `PUT /api/products/:id` - Actualizar producto (admin)
- `DELETE /api/products/:id` - Eliminar producto (admin)

### Búsquedas Avanzadas
- `GET /api/products?q=buscar` - Buscar por nombre
- `GET /api/products?category=categoria` - Filtrar por categoría
- `GET /api/products?price_min=100&price_max=500` - Filtrar por precio
- `GET /api/products?page=1&limit=10` - Paginación

## 👥 Usuarios de Prueba

**Usuario Normal:**
- Email: `soliscabrerajose7@gmail.com`
- Contraseña: `123456`

**Administrador:**
- Email: `admin3@sistema.com`  
- Contraseña: `admin123`

## 🛠️ Troubleshooting

### Error: "Firebase está deshabilitado"
- Verifica que `USE_FIREBASE=true` esté en tu `.env`

### Error: "MODULE_NOT_FOUND"
- Asegúrate de que `firebase-service-account.json` esté en la raíz del proyecto

### Error: "JSON inválido"
- Verifica que el contenido del archivo JSON sea válido
- No modifiques el archivo descargado de Firebase

## 📞 Soporte

Si tienes problemas, verifica:
1. Que el archivo `.env` exista y tenga `USE_FIREBASE=true`
2. Que las credenciales de Firebase estén configuradas correctamente
3. Que el proyecto de Firebase esté activo en la consola
4. Que Firestore esté habilitado en tu proyecto Firebase 