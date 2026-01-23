const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AlertaStock = sequelize.define('AlertaStock', {
    id_alerta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_producto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'productos',
            key: 'id_producto'
        }
    },
    tipo: {
        type: DataTypes.ENUM('stock_bajo', 'producto_vencido'),
        allowNull: false
    },
    mensaje: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    fecha_alerta: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    leida: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'alertas_stock',
    timestamps: false
});

module.exports = AlertaStock;
