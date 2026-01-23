const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// Todas las rutas requieren autenticación y rol de administrador
router.use(authMiddleware);
router.use(isAdmin);

router.get('/', usuariosController.getAllUsuarios);
router.post('/', usuariosController.createUsuario);
router.get('/:id', usuariosController.getUsuarioById);
router.put('/:id', usuariosController.updateUsuario);
router.delete('/:id', usuariosController.deleteUsuario);

module.exports = router;
