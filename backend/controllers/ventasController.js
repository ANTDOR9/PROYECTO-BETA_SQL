const { Venta, DetalleVenta, Producto, Cliente, Usuario } = require('../models');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

// Obtener todas las ventas
exports.getAllVentas = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin, estado } = req.query;

        let whereClause = {};

        if (fecha_inicio && fecha_fin) {
            whereClause.fecha_venta = {
                [Op.between]: [new Date(fecha_inicio), new Date(fecha_fin)]
            };
        }

        if (estado) {
            whereClause.estado = estado;
        }

        const ventas = await Venta.findAll({
            where: whereClause,
            include: [
                {
                    association: 'cliente',
                    attributes: ['id_cliente', 'nombre', 'apellido', 'dni']
                },
                {
                    association: 'usuario',
                    attributes: ['id_usuario', 'nombre', 'email']
                },
                {
                    association: 'detalles',
                    include: [{
                        association: 'producto',
                        attributes: ['id_producto', 'nombre', 'codigo_barras']
                    }]
                }
            ],
            order: [['fecha_venta', 'DESC']]
        });

        res.json({
            success: true,
            data: ventas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener ventas',
            error: error.message
        });
    }
};

// Obtener venta por ID
exports.getVentaById = async (req, res) => {
    try {
        const { id } = req.params;

        const venta = await Venta.findByPk(id, {
            include: [
                {
                    association: 'cliente',
                    attributes: ['id_cliente', 'nombre', 'apellido', 'dni', 'telefono']
                },
                {
                    association: 'usuario',
                    attributes: ['id_usuario', 'nombre', 'email']
                },
                {
                    association: 'detalles',
                    include: [{
                        association: 'producto',
                        attributes: ['id_producto', 'nombre', 'codigo_barras', 'precio_venta']
                    }]
                }
            ]
        });

        if (!venta) {
            return res.status(404).json({
                success: false,
                message: 'Venta no encontrada'
            });
        }

        res.json({
            success: true,
            data: venta
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener venta',
            error: error.message
        });
    }
};

// Registrar nueva venta
exports.createVenta = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const { id_cliente, productos, tipo_pago } = req.body;
        const id_usuario = req.usuario.id_usuario;

        // Validar que haya productos
        if (!productos || productos.length === 0) {
            await t.rollback();
            return res.status(400).json({
                success: false,
                message: 'Debe incluir al menos un producto'
            });
        }

        // Calcular subtotal
        let subtotal = 0;
        const detallesVenta = [];

        // Verificar stock y preparar detalles
        for (const item of productos) {
            const producto = await Producto.findByPk(item.id_producto);

            if (!producto) {
                await t.rollback();
                return res.status(404).json({
                    success: false,
                    message: `Producto con ID ${item.id_producto} no encontrado`
                });
            }

            if (producto.stock_actual < item.cantidad) {
                await t.rollback();
                return res.status(400).json({
                    success: false,
                    message: `Stock insuficiente para ${producto.nombre}. Stock disponible: ${producto.stock_actual}`
                });
            }

            const subtotalItem = parseFloat(producto.precio_venta) * item.cantidad;
            subtotal += subtotalItem;

            detallesVenta.push({
                id_producto: producto.id_producto,
                cantidad: item.cantidad,
                precio_unitario: producto.precio_venta,
                subtotal: subtotalItem
            });

            // Actualizar stock
            await producto.update({
                stock_actual: producto.stock_actual - item.cantidad
            }, { transaction: t });
        }

        // Calcular IGV (18%) y total
        const igv = subtotal * 0.18;
        const total = subtotal + igv;

        // Crear venta
        const nuevaVenta = await Venta.create({
            id_cliente: id_cliente || null,
            id_usuario,
            subtotal,
            igv,
            total,
            tipo_pago: tipo_pago || 'efectivo',
            estado: 'completada'
        }, { transaction: t });

        // Crear detalles de venta
        for (const detalle of detallesVenta) {
            await DetalleVenta.create({
                id_venta: nuevaVenta.id_venta,
                ...detalle
            }, { transaction: t });
        }

        await t.commit();

        // Obtener venta completa con relaciones
        const ventaCompleta = await Venta.findByPk(nuevaVenta.id_venta, {
            include: [
                { association: 'cliente' },
                { association: 'usuario' },
                {
                    association: 'detalles',
                    include: [{ association: 'producto' }]
                }
            ]
        });

        res.status(201).json({
            success: true,
            message: 'Venta registrada exitosamente',
            data: ventaCompleta
        });
    } catch (error) {
        await t.rollback();
        res.status(500).json({
            success: false,
            message: 'Error al registrar venta',
            error: error.message
        });
    }
};

// Obtener estadísticas de ventas
exports.getEstadisticas = async (req, res) => {
    try {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

        // Ventas del día
        const ventasHoy = await Venta.findAll({
            where: {
                fecha_venta: {
                    [Op.gte]: hoy
                },
                estado: 'completada'
            }
        });

        const totalHoy = ventasHoy.reduce((sum, venta) => sum + parseFloat(venta.total), 0);

        // Ventas del mes
        const ventasMes = await Venta.findAll({
            where: {
                fecha_venta: {
                    [Op.gte]: inicioMes
                },
                estado: 'completada'
            }
        });

        const totalMes = ventasMes.reduce((sum, venta) => sum + parseFloat(venta.total), 0);

        // Productos más vendidos
        const productosMasVendidos = await DetalleVenta.findAll({
            attributes: [
                'id_producto',
                [sequelize.fn('SUM', sequelize.col('cantidad')), 'total_vendido']
            ],
            include: [{
                association: 'producto',
                attributes: ['nombre', 'codigo_barras']
            }],
            group: ['id_producto'],
            order: [[sequelize.fn('SUM', sequelize.col('cantidad')), 'DESC']],
            limit: 10
        });

        res.json({
            success: true,
            data: {
                hoy: {
                    cantidad_ventas: ventasHoy.length,
                    total: totalHoy
                },
                mes: {
                    cantidad_ventas: ventasMes.length,
                    total: totalMes
                },
                productos_mas_vendidos: productosMasVendidos
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas',
            error: error.message
        });
    }
};
