const express = require('express');
const router = express.Router();
const alertasController = require('../controllers/alertasController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

router.get('/', alertasController.getAllAlertas);
router.post('/generar', alertasController.generarAlertas);
router.put('/:id/marcar-leida', alertasController.marcarLeida);
router.delete('/:id', alertasController.deleteAlerta);

module.exports = router;
