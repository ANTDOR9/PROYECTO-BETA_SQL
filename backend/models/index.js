const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Producto = require('./Producto');
const Cliente = require('./Cliente');
const Venta = require('./Venta');
const DetalleVenta = require('./DetalleVenta');
const AlertaStock = require('./AlertaStock');

// Relaciones entre modelos

// Usuario - Venta (Un usuario puede realizar muchas ventas)
Usuario.hasMany(Venta, {
    foreignKey: 'id_usuario',
    as: 'ventas'
});
Venta.belongsTo(Usuario, {
    foreignKey: 'id_usuario',
    as: 'usuario'
});

// Cliente - Venta (Un cliente puede tener muchas ventas)
Cliente.hasMany(Venta, {
    foreignKey: 'id_cliente',
    as: 'ventas'
});
Venta.belongsTo(Cliente, {
    foreignKey: 'id_cliente',
    as: 'cliente'
});

// Venta - DetalleVenta (Una venta tiene muchos detalles)
Venta.hasMany(DetalleVenta, {
    foreignKey: 'id_venta',
    as: 'detalles',
    onDelete: 'CASCADE'
});
DetalleVenta.belongsTo(Venta, {
    foreignKey: 'id_venta',
    as: 'venta'
});

// Producto - DetalleVenta (Un producto puede estar en muchos detalles de venta)
Producto.hasMany(DetalleVenta, {
    foreignKey: 'id_producto',
    as: 'detalles_venta'
});
DetalleVenta.belongsTo(Producto, {
    foreignKey: 'id_producto',
    as: 'producto'
});

// Producto - AlertaStock (Un producto puede tener muchas alertas)
Producto.hasMany(AlertaStock, {
    foreignKey: 'id_producto',
    as: 'alertas',
    onDelete: 'CASCADE'
});
AlertaStock.belongsTo(Producto, {
    foreignKey: 'id_producto',
    as: 'producto'
});

module.exports = {
    sequelize,
    Usuario,
    Producto,
    Cliente,
    Venta,
    DetalleVenta,
    AlertaStock
};
