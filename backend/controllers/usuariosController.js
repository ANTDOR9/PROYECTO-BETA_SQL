const { Usuario } = require('../models');
const bcrypt = require('bcryptjs');

// Obtener todos los usuarios
exports.getAllUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: { exclude: ['password'] },
            order: [['nombre', 'ASC']]
        });

        res.json({
            success: true,
            data: usuarios
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener usuarios',
            error: error.message
        });
    }
};

// Crear nuevo usuario
exports.createUsuario = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;

        // Validar campos requeridos
        if (!nombre || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Nombre, email y contraseña son requeridos'
            });
        }

        // Verificar que no exista un usuario con ese email
        const usuarioExistente = await Usuario.findOne({
            where: { email }
        });

        if (usuarioExistente) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe un usuario con ese email'
            });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario
        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            password: hashedPassword,
            rol: rol || 'vendedor',
            activo: true
        });

        // Excluir password de la respuesta
        const usuarioResponse = nuevoUsuario.toJSON();
        delete usuarioResponse.password;

        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            data: usuarioResponse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear usuario',
            error: error.message
        });
    }
};

// Obtener usuario por ID
exports.getUsuarioById = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            data: usuario
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener usuario',
            error: error.message
        });
    }
};

// Actualizar usuario
exports.updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Si se actualiza el email, verificar que no exista
        if (updateData.email && updateData.email !== usuario.email) {
            const usuarioExistente = await Usuario.findOne({
                where: { email: updateData.email }
            });

            if (usuarioExistente) {
                return res.status(400).json({
                    success: false,
                    message: 'Ya existe un usuario con ese email'
                });
            }
        }

        await usuario.update(updateData);

        res.json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            data: usuario
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar usuario',
            error: error.message
        });
    }
};

// Desactivar usuario
exports.deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        await usuario.update({ activo: false });

        res.json({
            success: true,
            message: 'Usuario desactivado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al desactivar usuario',
            error: error.message
        });
    }
};
