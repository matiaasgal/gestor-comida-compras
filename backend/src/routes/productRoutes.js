const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.post('/crear', productController.crearProducto);
router.delete('/eliminar', productController.eliminarProducto);
router.put('/actualizar', productController.editarProducto);
router.post('/compra', productController.registrarCompra);
router.post('/consumo', productController.registrarConsumo);
router.get('/inventario', productController.obtenerInventario);

router.get('/obtener-compras', productController.obtenerCompras);
router.get('/obtener-consumos', productController.obtenerConsumos);

module.exports = router;