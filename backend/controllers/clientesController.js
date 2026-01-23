const { Cliente } = require('../models');
const { Op } = require('sequelize');

// Obtener todos los clientes
exports.getAllClientes = async (req, res) => {
    try {
        const { buscar } = req.query;

        let whereClause = {};

        if (buscar) {
            whereClause[Op.or] = [
                { nombre: { [Op.like]: `%${buscar}%` } },
                { apellido: { [Op.like]: `%${buscar}%` } },
                { dni: { [Op.like]: `%${buscar}%` } },
                { email: { [Op.like]: `%${buscar}%` } }
            ];
        }

        const clientes = await Cliente.findAll({
            where: whereClause,
            order: [['apellido', 'ASC'], ['nombre', 'ASC']]
        });

        res.json({
            success: true,
            data: clientes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener clientes',
            error: error.message
        });
    }
};

// Obtener cliente por ID
exports.getClienteById = async (req, res) => {
    try {
        const { id } = req.params;

        const cliente = await Cliente.findByPk(id, {
            include: [{
                association: 'ventas',
                limit: 10,
                order: [['fecha_venta', 'DESC']]
            }]
        });

        if (!cliente) {
            return res.status(404).json({
                success: false,
                message: 'Cliente no encontrado'
            });
        }

        res.json({
            success: true,
            data: cliente
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener cliente',
            error: error.message
        });
    }
};

// Crear cliente
exports.createCliente = async (req, res) => {
    try {
        const clienteData = req.body;

        // Verificar si el DNI ya existe
        if (clienteData.dni) {
            const clienteExistente = await Cliente.findOne({
                where: { dni: clienteData.dni }
            });

            if (clienteExistente) {
                return res.status(400).json({
                    success: false,
                    message: 'Ya existe un cliente con ese DNI'
                });
            }
        }

        const nuevoCliente = await Cliente.create(clienteData);

        res.status(201).json({
            success: true,
            message: 'Cliente creado exitosamente',
            data: nuevoCliente
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear cliente',
            error: error.message
        });
    }
};

// Actualizar cliente
exports.updateCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const cliente = await Cliente.findByPk(id);

        if (!cliente) {
            return res.status(404).json({
                success: false,
                message: 'Cliente no encontrado'
            });
        }

        // Si se actualiza el DNI, verificar que no exista
        if (updateData.dni && updateData.dni !== cliente.dni) {
            const clienteExistente = await Cliente.findOne({
                where: { dni: updateData.dni }
            });

            if (clienteExistente) {
                return res.status(400).json({
                    success: false,
                    message: 'Ya existe un cliente con ese DNI'
                });
            }
        }

        await cliente.update(updateData);

        res.json({
            success: true,
            message: 'Cliente actualizado exitosamente',
            data: cliente
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar cliente',
            error: error.message
        });
    }
};

// Eliminar cliente
exports.deleteCliente = async (req, res) => {
    try {
        const { id } = req.params;

        const cliente = await Cliente.findByPk(id);

        if (!cliente) {
            return res.status(404).json({
                success: false,
                message: 'Cliente no encontrado'
            });
        }

        await cliente.destroy();

        res.json({
            success: true,
            message: 'Cliente eliminado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar cliente',
            error: error.message
        });
    }
};
