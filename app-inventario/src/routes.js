/**
 * Rutas de la API REST para gestión de inventario.
 *
 * Cada ruta implementa una operación CRUD sobre la tabla `productos`.
 * Los errores de base de datos se capturan y devuelven como HTTP 500
 * con un mensaje descriptivo para facilitar la depuración distribuida.
 *
 * Convención de respuestas:
 *   - Éxito: { success: true, data: ... }
 *   - Error: { success: false, message: "descripción del error" }
 */

const express = require('express');
const router = express.Router();
const pool = require('./db');

// -------------------------------------------------------------------
// GET /api/productos
// Devuelve todos los productos ordenados por ID ascendente.
// -------------------------------------------------------------------
router.get('/productos', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM productos ORDER BY id ASC'
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Error al listar productos:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------------
// GET /api/productos/:id
// Busca un producto por su ID primario.
// Devuelve 404 si no existe, evitando ambigüedades en el cliente.
// -------------------------------------------------------------------
router.get('/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM productos WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Producto con id ${id} no encontrado.`
      });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error al consultar producto:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------------
// GET /api/productos/buscar/:nombre
// Búsqueda parcial por nombre (ILIKE = case-insensitive en PostgreSQL).
// Permite encontrar "laptop" buscando "lap" o "LAP".
// -------------------------------------------------------------------
router.get('/productos/buscar/:nombre', async (req, res) => {
  try {
    const { nombre } = req.params;
    const result = await pool.query(
      'SELECT * FROM productos WHERE nombre ILIKE $1 ORDER BY nombre ASC',
      [`%${nombre}%`]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Error en búsqueda por nombre:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------------
// POST /api/productos
// Registra un nuevo producto en el inventario.
// Todos los campos son requeridos; la validación básica ocurre aquí
// antes de llegar a la base de datos (fail fast).
// -------------------------------------------------------------------
router.post('/productos', async (req, res) => {
  try {
    const { nombre, descripcion, cantidad, precio } = req.body;

    // Validación de campos obligatorios antes de la consulta SQL
    if (!nombre || !descripcion || cantidad === undefined || precio === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos: nombre, descripcion, cantidad, precio.'
      });
    }

    const result = await pool.query(
      `INSERT INTO productos (nombre, descripcion, cantidad, precio)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [nombre, descripcion, cantidad, precio]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error al registrar producto:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------------
// PUT /api/productos/:id
// Actualiza el stock (cantidad) de un producto existente.
// Solo modifica la cantidad para mantener un historial claro
// de cambios de inventario versus cambios de datos maestros.
// -------------------------------------------------------------------
router.put('/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad } = req.body;

    if (cantidad === undefined) {
      return res.status(400).json({
        success: false,
        message: 'El campo "cantidad" es requerido para actualizar stock.'
      });
    }

    const result = await pool.query(
      `UPDATE productos SET cantidad = $1 WHERE id = $2 RETURNING *`,
      [cantidad, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Producto con id ${id} no encontrado.`
      });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error al actualizar stock:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------------
// DELETE /api/productos/:id
// Elimina un producto permanentemente del inventario.
// Devuelve el registro eliminado como confirmación de la operación.
// -------------------------------------------------------------------
router.delete('/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM productos WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Producto con id ${id} no encontrado.`
      });
    }

    res.json({
      success: true,
      message: 'Producto eliminado.',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error al eliminar producto:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;