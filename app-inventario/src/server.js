/**
 * Punto de entrada del servidor de la aplicación de inventario.
 *
 * Responsabilidades de este módulo:
 *  - Configurar el servidor Express con middlewares esenciales.
 *  - Montar las rutas de la API bajo el prefijo /api.
 *  - Servir la interfaz web estática desde /public.
 *  - Escuchar en el puerto definido en las variables de entorno.
 */

const express = require('express');
const path = require('path');
require('dotenv').config();

const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear cuerpos JSON en las solicitudes entrantes
app.use(express.json());

// Servir archivos estáticos (HTML, CSS, JS del cliente) desde /public
app.use(express.static(path.join(__dirname, '..', 'public')));

// Montar todas las rutas de la API bajo el prefijo /api
app.use('/api', routes);

// Ruta raíz: devuelve la interfaz web principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  // 0.0.0.0 para que Docker exponga el puerto en todas las interfaces,
  // incluyendo la de Tailscale, y no solo en localhost.
  console.log(`Servidor de inventario corriendo en el puerto ${PORT}`);
});