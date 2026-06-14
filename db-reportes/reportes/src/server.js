/**
 * Servidor HTTP del módulo de reportes.
 *
 * Expone tres endpoints de consulta de solo lectura que consumen
 * las funciones del módulo reportes.js y los sirve como:
 *   - Respuestas JSON en /api/reportes/*  (para integración)
 *   - Interfaz web en /                   (para presentación visual)
 *
 * Este servicio NO modifica datos; es de solo lectura sobre la BD.
 */

const express = require('express');
const path = require('path');
const { productosConBajoStock, top5ProductosPorValor, resumenGeneral } = require('./reportes');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.static(path.join(__dirname, '..', 'public')));

// -------------------------------------------------------------------
// GET /api/reportes/bajo-stock
// Productos con cantidad < 5 unidades (alerta de reabastecimiento).
// -------------------------------------------------------------------
app.get('/api/reportes/bajo-stock', async (req, res) => {
  try {
    const datos = await productosConBajoStock();
    res.json({ success: true, reporte: 'Productos con bajo stock', data: datos });
  } catch (err) {
    console.error('Error en reporte bajo-stock:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------------
// GET /api/reportes/top-valor
// Los 5 productos con mayor valor total (cantidad × precio).
// -------------------------------------------------------------------
app.get('/api/reportes/top-valor', async (req, res) => {
  try {
    const datos = await top5ProductosPorValor();
    res.json({ success: true, reporte: 'Top 5 por valor en inventario', data: datos });
  } catch (err) {
    console.error('Error en reporte top-valor:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------------
// GET /api/reportes/resumen
// Estadísticas generales: total productos, unidades y valor acumulado.
// -------------------------------------------------------------------
app.get('/api/reportes/resumen', async (req, res) => {
  try {
    const datos = await resumenGeneral();
    res.json({ success: true, reporte: 'Resumen general del inventario', data: datos });
  } catch (err) {
    console.error('Error en reporte resumen:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servicio de reportes corriendo en el puerto ${PORT}`);
});