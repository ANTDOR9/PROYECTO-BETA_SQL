const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Rutas públicas
router.post('/login', authController.login);

// Rutas protegidas
router.post('/register', authMiddleware, authController.register);
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
