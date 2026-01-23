const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const { jwtSecret, jwtExpiration } = require('../config/auth');

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar campos
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email y contraseña son requeridos'
            });
        }

        // Buscar usuario
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Verificar si está activo
        if (!usuario.activo) {
            return res.status(401).json({
                success: false,
                message: 'Usuario inactivo'
            });
        }

        // Comparar contraseña
        const isPasswordValid = await usuario.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Generar token
        const token = jwt.sign(
            {
                id: usuario.id_usuario,
                email: usuario.email,
                rol: usuario.rol
            },
            jwtSecret,
            { expiresIn: jwtExpiration }
        );

        res.json({
            success: true,
            message: 'Login exitoso',
            data: {
                token,
                usuario: {
                    id: usuario.id_usuario,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    rol: usuario.rol
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

// Register (solo admin puede registrar usuarios)
exports.register = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;

        // Validar campos
        if (!nombre || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos'
            });
        }

        // Verificar si el email ya existe
        const usuarioExistente = await Usuario.findOne({ where: { email } });

        if (usuarioExistente) {
            return res.status(400).json({
                success: false,
                message: 'El email ya está registrado'
            });
        }

        // Crear usuario
        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            password,
            rol: rol || 'vendedor'
        });

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: nuevoUsuario
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al registrar usuario',
            error: error.message
        });
    }
};

// Obtener perfil del usuario autenticado
exports.getProfile = async (req, res) => {
    try {
        res.json({
            success: true,
            data: req.usuario
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener perfil',
            error: error.message
        });
    }
};
