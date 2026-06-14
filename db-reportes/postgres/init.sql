-- Script de inicialización ejecutado automáticamente al crear el contenedor.
-- Crea la tabla de productos con los campos mínimos requeridos por el sistema.
-- Este script solo se ejecuta si la base de datos NO existe aún (volumen vacío).

-- Tabla principal del sistema de inventario
CREATE TABLE IF NOT EXISTS productos (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(150) NOT NULL,
    descripcion TEXT,
    cantidad    INTEGER NOT NULL DEFAULT 0 CHECK (cantidad >= 0),
    precio      NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (precio >= 0)
);

-- Índice para acelerar las búsquedas por nombre (usadas frecuentemente en consultas)
CREATE INDEX IF NOT EXISTS idx_productos_nombre ON productos (nombre);

-- Datos de ejemplo para verificar el funcionamiento al levantar el sistema
INSERT INTO productos (nombre, descripcion, cantidad, precio) VALUES
    ('Laptop Dell XPS 13',    'Procesador i7, 16GB RAM, 512GB SSD',  8,  1299.99),
    ('Mouse Inalámbrico',     'Logitech M510, receptor USB nano',    3,  25.50),
    ('Teclado Mecánico',      'Switches Cherry MX Red, TKL',        12,  89.99),
    ('Monitor LG 24"',        '1080p, 75Hz, panel IPS',             2,  199.00),
    ('Auriculares Sony',      'WH-1000XM5, cancelación de ruido',   6,  349.99),
    ('Cable HDMI 2m',         'Versión 2.1, soporte 4K@120Hz',      20,   8.99),
    ('Hub USB-C',             '7 puertos, carga rápida 65W',        4,  39.99),
    ('Webcam Full HD',        '1080p/30fps, micrófono integrado',   1,  79.99);