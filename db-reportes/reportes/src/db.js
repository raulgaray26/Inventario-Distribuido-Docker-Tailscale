/**
 * Conexión a PostgreSQL desde el servicio de reportes.
 *
 * IMPORTANTE: Este servicio se conecta a la base de datos usando el
 * nombre del servicio Docker ("postgres-db"), no por IP. Esto es posible
 * porque ambos contenedores comparten la red Docker interna "inventario-network".
 *
 * La resolución por nombre de servicio funciona dentro de Docker Compose:
 *   postgres-db:5432  →  IP interna del contenedor de PostgreSQL
 *
 * Esto es diferente al Estudiante 1, quien debe usar la IP de Tailscale
 * porque está en una máquina física distinta, fuera de la red Docker.
 */

const { Pool } = require('pg');

const pool = new Pool({
  // Nombre del servicio definido en docker-compose.yml, no una IP.
  // Docker Compose resuelve este nombre automáticamente dentro de la red interna.
  host: 'postgres-db',
  port: 5432,
  database: process.env.POSTGRES_DB || 'inventario',
  user: process.env.POSTGRES_USER || 'admin',
  password: process.env.POSTGRES_PASSWORD || 'admin123',
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error al conectar desde reportes a la BD:', err.message);
    return;
  }
  release();
  console.log('Servicio de reportes conectado a PostgreSQL correctamente.');
});

module.exports = pool;