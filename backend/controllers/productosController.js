const { Producto, AlertaStock } = require('../models');
const { Op } = require('sequelize');

// Obtener todos los productos
exports.getAllProductos = async (req, res) => {
    try {
        const { categoria, buscar, activo } = req.query;

        let whereClause = {};

        if (categoria) {
            whereClause.categoria = categoria;
        }

        if (buscar) {
            whereClause[Op.or] = [
                { nombre: { [Op.like]: `%${buscar}%` } },
                { codigo_barras: { [Op.like]: `%${buscar}%` } },
                { laboratorio: { [Op.like]: `%${buscar}%` } }
            ];
        }

        if (activo !== undefined) {
            whereClause.activo = activo === 'true';
        }

        const productos = await Producto.findAll({
            where: whereClause,
            order: [['nombre', 'ASC']]
        });

        res.json({
            success: true,
            data: productos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener productos',
            error: error.message
        });
    }
};

// Obtener producto por ID
exports.getProductoById = async (req, res) => {
    try {
        const { id } = req.params;

        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        res.json({
            success: true,
            data: producto
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener producto',
            error: error.message
        });
    }
};

// Crear producto
exports.createProducto = async (req, res) => {
    try {
        const productoData = req.body;

        const nuevoProducto = await Producto.create(productoData);

        // Verificar si necesita alerta de stock bajo
        if (nuevoProducto.stock_actual <= nuevoProducto.stock_minimo) {
            await AlertaStock.create({
                id_producto: nuevoProducto.id_producto,
                tipo: 'stock_bajo',
                mensaje: `El producto "${nuevoProducto.nombre}" tiene stock bajo (${nuevoProducto.stock_actual} unidades)`
            });
        }

        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            data: nuevoProducto
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear producto',
            error: error.message
        });
    }
};

// Actualizar producto
exports.updateProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        await producto.update(updateData);

        // Verificar alertas de stock
        if (producto.stock_actual <= producto.stock_minimo) {
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
                    mensaje: `El producto "${producto.nombre}" tiene stock bajo (${producto.stock_actual} unidades)`
                });
            }
        }

        res.json({
            success: true,
            message: 'Producto actualizado exitosamente',
            data: producto
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar producto',
            error: error.message
        });
    }
};

// Eliminar producto (soft delete)
exports.deleteProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        await producto.update({ activo: false });

        res.json({
            success: true,
            message: 'Producto eliminado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar producto',
            error: error.message
        });
    }
};

// Obtener productos con stock bajo
exports.getProductosBajoStock = async (req, res) => {
    try {
        // Obtener todos los productos activos primero
        const todosProductos = await Producto.findAll({
            where: {
                activo: true
            },
            order: [['stock_actual', 'ASC']]
        });

        // Filtrar los que tienen stock bajo
        const productos = todosProductos.filter(p => p.stock_actual <= p.stock_minimo);

        res.json({
            success: true,
            data: productos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener productos con stock bajo',
            error: error.message
        });
    }
};
