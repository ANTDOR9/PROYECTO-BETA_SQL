const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventasController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

router.get('/', ventasController.getAllVentas);
router.get('/estadisticas', ventasController.getEstadisticas);
router.get('/:id', ventasController.getVentaById);
router.post('/', ventasController.createVenta);

module.exports = router;
