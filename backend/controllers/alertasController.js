const { AlertaStock, Producto } = require('../models');

// Obtener todas las alertas
exports.getAllAlertas = async (req, res) => {
    try {
        const { leida } = req.query;

        let whereClause = {};

        if (leida !== undefined) {
            whereClause.leida = leida === 'true';
        }

        const alertas = await AlertaStock.findAll({
            where: whereClause,
            include: [{
                association: 'producto',
                attributes: ['id_producto', 'nombre', 'stock_actual', 'stock_minimo', 'codigo_barras']
            }],
            order: [['fecha_alerta', 'DESC']]
        });

        res.json({
            success: true,
            data: alertas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener alertas',
            error: error.message
        });
    }
};

// Marcar alerta como leída
exports.marcarLeida = async (req, res) => {
    try {
        const { id } = req.params;

        const alerta = await AlertaStock.findByPk(id);

        if (!alerta) {
            return res.status(404).json({
                success: false,
                message: 'Alerta no encontrada'
            });
        }

        await alerta.update({ leida: true });

        res.json({
            success: true,
            message: 'Alerta marcada como leída',
            data: alerta
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar alerta',
            error: error.message
        });
    }
};

// Eliminar alerta
exports.deleteAlerta = async (req, res) => {
    try {
        const { id } = req.params;

        const alerta = await AlertaStock.findByPk(id);

        if (!alerta) {
            return res.status(404).json({
                success: false,
                message: 'Alerta no encontrada'
            });
        }

        await alerta.destroy();

        res.json({
            success: true,
            message: 'Alerta eliminada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar alerta',
            error: error.message
        });
    }
};

// Generar alertas (endpoint HTTP)
exports.generarAlertas = async (req, res) => {
    try {
        const { Op } = require('sequelize');
        const sequelize = require('../config/database');
        let alertasCreadas = 0;

        // Buscar productos con stock bajo
        const productosStockBajo = await Producto.findAll({
            where: {
                activo: true
            }
        });

        // Filtrar productos con stock bajo manualmente
        const productosBajoStock = productosStockBajo.filter(p => p.stock_actual <= p.stock_minimo);

        for (const producto of productosBajoStock) {
            // Verificar si ya existe una alerta no leída
            const alertaExistente = await AlertaStock.findOne({
                where: {
                    id_producto: producto.id_producto,
                    tipo: 'stock_bajo',
                    leida: false
                }
            });

            if (!alertaExistente) {
                await AlertaStock.create({
                    id_producto: producto.id_producto,
                    tipo: 'stock_bajo',
                    mensaje: `El producto "${producto.nombre}" tiene stock bajo (${producto.stock_actual} unidades). Stock mínimo: ${producto.stock_minimo}`
                });
                alertasCreadas++;
            }
        }

        // Buscar productos próximos a vencer (30 días)
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() + 30);

        const productosProximosVencer = await Producto.findAll({
            where: {
                fecha_vencimiento: {
                    [Op.lte]: fechaLimite,
                    [Op.gte]: new Date()
                },
                activo: true
            }
        });

        for (const producto of productosProximosVencer) {
            const alertaExistente = await AlertaStock.findOne({
                where: {
                    id_producto: producto.id_producto,
                    tipo: 'producto_vencido',
                    leida: false
                }
            });

            if (!alertaExistente) {
                const fechaVenc = new Date(producto.fecha_vencimiento).toLocaleDateString('es-ES');
                await AlertaStock.create({
                    id_producto: producto.id_producto,
                    tipo: 'producto_vencido',
                    mensaje: `El producto "${producto.nombre}" vencerá el ${fechaVenc}`
                });
                alertasCreadas++;
            }
        }

        res.json({
            success: true,
            message: `Se generaron ${alertasCreadas} nuevas alertas`,
            alertasCreadas: alertasCreadas
        });
    } catch (error) {
        console.error('Error al generar alertas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al generar alertas',
            error: error.message
        });
    }
};

