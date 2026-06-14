/**
 * Módulo de conexión a la base de datos PostgreSQL.
 *
 * Usa un pool de conexiones para reutilizar conexiones TCP abiertas
 * en lugar de abrir una nueva por cada consulta, lo cual sería
 * costoso en un sistema distribuido con latencia de red (Tailscale).
 *
 * Todas las credenciales se leen desde variables de entorno (.env)
 * para evitar hardcodear datos sensibles en el repositorio.
 */

const { Pool } = require('pg');
require('dotenv').config();

// Pool de conexiones configurado desde variables de entorno.
// Esto permite cambiar el host (IP de Tailscale) sin modificar código.
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

/**
 * Prueba la conexión al iniciar la aplicación.
 * Lanza un error explícito si la base de datos no es alcanzable,
 * lo que permite detectar problemas de red o configuración temprano.
 */
pool.connect((err, client, release) => {
  if (err) {
    // Error de conexión: puede ser IP incorrecta, Tailscale inactivo,
    // o credenciales erróneas. Revisar .env y estado de Tailscale.
    console.error('Error al conectar con la base de datos:', err.message);
    return;
  }
  release();
  console.log('Conexión a PostgreSQL establecida correctamente.');
});

module.exports = pool;