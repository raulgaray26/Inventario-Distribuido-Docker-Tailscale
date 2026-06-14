/**
 * Módulo de lógica de negocio para generación de reportes de inventario.
 *
 * Cada función ejecuta una consulta SQL específica y devuelve los
 * datos sin formatear, dejando la presentación al servidor HTTP.
 *
 * Las consultas usan ORDER BY para resultados deterministas y
 * LIMIT donde aplica para controlar el tamaño de respuesta.
 */

const pool = require('./db');

/**
 * Obtiene productos con stock menor a 5 unidades.
 * Usados para generar alertas de reabastecimiento.
 * @returns {Promise<Array>} Lista de productos con bajo stock.
 */
async function productosConBajoStock() {
  const result = await pool.query(
    `SELECT id, nombre, descripcion, cantidad, precio
     FROM productos
     WHERE cantidad < 5
     ORDER BY cantidad ASC`
  );
  return result.rows;
}

/**
 * Obtiene los 5 productos con mayor valor total en inventario.
 * Valor total = cantidad × precio_unitario.
 * Útil para priorizar productos en auditorías o seguros de inventario.
 * @returns {Promise<Array>} Top 5 productos por valor total.
 */
async function top5ProductosPorValor() {
  const result = await pool.query(
    `SELECT
       id,
       nombre,
       cantidad,
       precio,
       (cantidad * precio) AS valor_total
     FROM productos
     ORDER BY valor_total DESC
     LIMIT 5`
  );
  return result.rows;
}

/**
 * Genera el resumen ejecutivo del inventario completo.
 * Incluye conteo total de productos, unidades y valor acumulado.
 * @returns {Promise<Object>} Objeto con métricas resumen del inventario.
 */
async function resumenGeneral() {
  const result = await pool.query(
    `SELECT
       COUNT(*)                            AS total_productos,
       COALESCE(SUM(cantidad), 0)          AS total_unidades,
       COALESCE(SUM(cantidad * precio), 0) AS valor_total_inventario
     FROM productos`
  );
  return result.rows[0];
}

module.exports = {
  productosConBajoStock,
  top5ProductosPorValor,
  resumenGeneral,
};