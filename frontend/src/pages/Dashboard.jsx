import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api/axios.config';
import Loading from '../components/common/Loading';
import M from 'materialize-css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';

// Registrar componentes de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Dashboard = () => {
    const { usuario } = useAuth();
    const [estadisticas, setEstadisticas] = useState(null);
    const [alertas, setAlertas] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const [statsRes, alertasRes] = await Promise.all([
                api.get('/ventas/estadisticas'),
                api.get('/alertas?leida=false')
            ]);

            if (statsRes.data.success) {
                setEstadisticas(statsRes.data.data);
            }

            if (alertasRes.data.success) {
                setAlertas(alertasRes.data.data);
                const badge = document.getElementById('alert-count');
                if (badge) badge.textContent = alertasRes.data.data.length;
            }
        } catch (error) {
            console.error('Error al cargar datos:', error);
            M.toast({ html: 'Error al cargar datos del dashboard', classes: 'red' });
        } finally {
            setCargando(false);
        }
    };

    if (cargando) {
        return <Loading />;
    }

    // Configuración del gráfico de ventas
    const ventasChartData = {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        datasets: [
            {
                label: 'Ventas de la Semana',
                data: [12, 19, 15, 25, 22, 30, 28],
                fill: true,
                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                borderColor: 'rgb(102, 126, 234)',
                tension: 0.4,
                pointBackgroundColor: 'rgb(102, 126, 234)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(102, 126, 234)',
                pointRadius: 5,
                pointHoverRadius: 7,
            },
        ],
    };

    const ventasChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                borderRadius: 8,
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 13 },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    // Gráfico de productos mástop 5 vendidos
    const topProductosData = {
        labels: estadisticas?.productos_mas_vendidos?.slice(0, 5).map(p => p.producto?.nombre.substring(0, 20)) || [],
        datasets: [
            {
                label: 'Unidades Vendidas',
                data: estadisticas?.productos_mas_vendidos?.slice(0, 5).map(p => p.total_vendido) || [],
                backgroundColor: [
                    'rgba(102, 126, 234, 0.8)',
                    'rgba(17, 153, 142, 0.8)',
                    'rgba(238, 9, 121, 0.8)',
                    'rgba(33, 147, 176, 0.8)',
                    'rgba(245, 87, 108, 0.8)',
                ],
                borderRadius: 8,
            },
        ],
    };

    const topProductosOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    // Gráfico de categorías (Doughnut)
    const categoriasData = {
        labels: ['Medicamentos', 'Vitaminas', 'Material Médico', 'Higiene', 'Otros'],
        datasets: [
            {
                data: [45, 20, 15, 12, 8],
                backgroundColor: [
                    'rgba(102, 126, 234, 0.8)',
                    'rgba(17, 153, 142, 0.8)',
                    'rgba(238, 9, 121, 0.8)',
                    'rgba(33, 147, 176, 0.8)',
                    'rgba(245, 87, 108, 0.8)',
                ],
                borderWidth: 0,
            },
        ],
    };

    const categoriasOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 15,
                    font: { size: 12 },
                },
            },
        },
    };

    // Animaciones con Framer Motion
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 },
        },
    };

    return (
        <motion.div
            className="container"
            style={{ marginTop: '20px' }}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Header */}
            <motion.div variants={itemVariants}>
                <h4 className="page-title">
                    <i className="material-icons">dashboard</i>
                    Dashboard
                </h4>
            </motion.div>

            {/* Mensaje de bienvenida */}
            <motion.div variants={itemVariants} className="card" style={{ background: 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)', border: '1px solid rgba(102,126,234,0.2)' }}>
                <div className="card-content">
                    <h5 style={{ margin: 0, marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                        <i className="material-icons" style={{ marginRight: '10px', fontSize: '2rem' }}>waving_hand</i>
                        ¡Bienvenido, {usuario?.nombre}!
                    </h5>
                    <p style={{ margin: 0, color: '#666' }}>Sistema de Gestión de Inventario y Ventas - Botica Nova Salud</p>
                </div>
            </motion.div>

            {/* Estadísticas Cards */}
            <motion.div variants={containerVariants} className="row">
                <motion.div variants={itemVariants} className="col s12 m6 l3">
                    <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)' }}>
                        <i className="material-icons stat-card-icon" style={{ color: '#667eea' }}>attach_money</i>
                        <div className="stat-card-value" style={{ color: '#667eea' }}>
                            S/ {estadisticas?.hoy?.total?.toFixed(2) || '0.00'}
                        </div>
                        <div className="stat-card-label">Ventas Hoy</div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="col s12 m6 l3">
                    <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(17,153,142,0.1) 0%, rgba(56,239,125,0.1) 100%)' }}>
                        <i className="material-icons stat-card-icon" style={{ color: '#11998e' }}>shopping_cart</i>
                        <div className="stat-card-value" style={{ color: '#11998e' }}>
                            {estadisticas?.hoy?.cantidad_ventas || 0}
                        </div>
                        <div className="stat-card-label">Transacciones Hoy</div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="col s12 m6 l3">
                    <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(33,147,176,0.1) 0%, rgba(109,213,237,0.1) 100%)' }}>
                        <i className="material-icons stat-card-icon" style={{ color: '#2193b0' }}>trending_up</i>
                        <div className="stat-card-value" style={{ color: '#2193b0' }}>
                            S/ {estadisticas?.mes?.total?.toFixed(2) || '0.00'}
                        </div>
                        <div className="stat-card-label">Ventas del Mes</div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="col s12 m6 l3">
                    <Link to="/alertas" style={{ textDecoration: 'none' }}>
                        <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(238,9,121,0.1) 0%, rgba(255,106,0,0.1) 100%)' }}>
                            <i className="material-icons stat-card-icon" style={{ color: '#ee0979' }}>warning</i>
                            <div className="stat-card-value" style={{ color: '#ee0979' }}>{alertas.length}</div>
                            <div className="stat-card-label">Alertas Activas</div>
                        </div>
                    </Link>
                </motion.div>
            </motion.div>

            {/* Gráficos */}
            <div className="row">
                {/* Gráfico de Ventas Semanales */}
                <motion.div variants={itemVariants} className="col s12 l8">
                    <div className="card">
                        <div className="card-content">
                            <span className="card-title">
                                <i className="material-icons">show_chart</i>
                                Ventas de la Semana
                            </span>
                            <div style={{ height: '300px', position: 'relative' }}>
                                <Line data={ventasChartData} options={ventasChartOptions} />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Gráfico de Categorías */}
                <motion.div variants={itemVariants} className="col s12 l4">
                    <div className="card">
                        <div className="card-content">
                            <span className="card-title">
                                <i className="material-icons">pie_chart</i>
                                Productos por Categoría
                            </span>
                            <div style={{ height: '300px', position: 'relative', paddingTop: '20px' }}>
                                <Doughnut data={categoriasData} options={categoriasOptions} />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="row">
                {/* Top Productos Vendidos */}
                <motion.div variants={itemVariants} className="col s12 l6">
                    <div className="card">
                        <div className="card-content">
                            <span className="card-title">
                                <i className="material-icons">star</i>
                                Top 5 Productos Más Vendidos
                            </span>
                            <div style={{ height: '300px', position: 'relative' }}>
                                <Bar data={topProductosData} options={topProductosOptions} />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Alertas Recientes */}
                <motion.div variants={itemVariants} className="col s12 l6">
                    <div className="card">
                        <div className="card-content">
                            <span className="card-title">
                                <i className="material-icons">notifications_active</i>
                                Alertas Recientes
                            </span>
                            {alertas.length > 0 ? (
                                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {alertas.slice(0, 5).map((alerta, index) => (
                                        <motion.div
                                            key={alerta.id_alerta}
                                            className="alert-item"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                marginBottom: '10px',
                                                padding: '12px',
                                                borderLeft: `4px solid ${alerta.tipo === 'stock_bajo' ? '#ff9800' : '#f44336'}`,
                                            }}
                                        >
                                            <i className="material-icons" style={{ marginRight: '12px', color: alerta.tipo === 'stock_bajo' ? '#ff9800' : '#f44336' }}>
                                                {alerta.tipo === 'stock_bajo' ? 'inventory' : 'event_busy'}
                                            </i>
                                            <div style={{ flex: 1 }}>
                                                <strong style={{ display: 'block', marginBottom: '4px' }}>{alerta.producto?.nombre}</strong>
                                                <small style={{ color: '#666' }}>{alerta.mensaje}</small>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="center-align" style={{ padding: '40px 0' }}>
                                    <i className="material-icons large" style={{ color: '#11998e', fontSize: '4rem' }}>check_circle</i>
                                    <p style={{ color: '#999', marginTop: '10px' }}>No hay alertas activas</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Accesos Rápidos */}
            <motion.div variants={containerVariants} className="row">
                <motion.div variants={itemVariants} className="col s12">
                    <div className="card">
                        <div className="card-content">
                            <span className="card-title">
                                <i className="material-icons">bolt</i>
                                Accesos Rápidos
                            </span>
                            <div className="row" style={{ marginTop: '20px' }}>
                                <div className="col s12 m6 l3">
                                    <Link to="/ventas" style={{ textDecoration: 'none' }}>
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            style={{
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                borderRadius: '12px',
                                                padding: '20px',
                                                textAlign: 'center',
                                                color: 'white',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <i className="material-icons" style={{ fontSize: '3rem' }}>point_of_sale</i>
                                            <p style={{ margin: '10px 0 0', fontWeight: '600' }}>Nueva Venta</p>
                                        </motion.div>
                                    </Link>
                                </div>
                                <div className="col s12 m6 l3">
                                    <Link to="/productos/nuevo" style={{ textDecoration: 'none' }}>
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            style={{
                                                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                                                borderRadius: '12px',
                                                padding: '20px',
                                                textAlign: 'center',
                                                color: 'white',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <i className="material-icons" style={{ fontSize: '3rem' }}>add_box</i>
                                            <p style={{ margin: '10px 0 0', fontWeight: '600' }}>Nuevo Producto</p>
                                        </motion.div>
                                    </Link>
                                </div>
                                <div className="col s12 m6 l3">
                                    <Link to="/clientes" style={{ textDecoration: 'none' }}>
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            style={{
                                                background: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
                                                borderRadius: '12px',
                                                padding: '20px',
                                                textAlign: 'center',
                                                color: 'white',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <i className="material-icons" style={{ fontSize: '3rem' }}>person_add</i>
                                            <p style={{ margin: '10px 0 0', fontWeight: '600' }}>Nuevo Cliente</p>
                                        </motion.div>
                                    </Link>
                                </div>
                                <div className="col s12 m6 l3">
                                    <Link to="/productos" style={{ textDecoration: 'none' }}>
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            style={{
                                                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                                borderRadius: '12px',
                                                padding: '20px',
                                                textAlign: 'center',
                                                color: 'white',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <i className="material-icons" style={{ fontSize: '3rem' }}>inventory_2</i>
                                            <p style={{ margin: '10px 0 0', fontWeight: '600' }}>Ver Inventario</p>
                                        </motion.div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default Dashboard;
