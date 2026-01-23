import React, { useState, useEffect } from 'react';
import api from '../api/axios.config';
import Loading from '../components/common/Loading';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import M from 'materialize-css';

const Reportes = () => {
    const [cargando, setCargando] = useState(true);
    const [estadisticas, setEstadisticas] = useState(null);
    const [ventasHoy, setVentasHoy] = useState([]);
    const [productosBajoStock, setProductosBajoStock] = useState([]);
    const [filtroTiempo, setFiltroTiempo] = useState('hoy');

    useEffect(() => {
        cargarDatos();
    }, [filtroTiempo]);

    useEffect(() => {
        const selects = document.querySelectorAll('select');
        M.FormSelect.init(selects);
    }, []);

    const cargarDatos = async () => {
        try {
            const [statsRes, ventasRes, productosRes] = await Promise.all([
                api.get('/ventas/estadisticas'),
                api.get('/ventas'),
                api.get('/productos/bajo-stock')
            ]);

            if (statsRes.data.success) setEstadisticas(statsRes.data.data);
            if (ventasRes.data.success) setVentasHoy(ventasRes.data.data);
            if (productosRes.data.success) setProductosBajoStock(productosRes.data.data);
        } catch (error) {
            M.toast({ html: 'Error al cargar reportes', classes: 'red' });
        } finally {
            setCargando(false);
        }
    };

    if (cargando) return <Loading />;

    // Datos para gráficos
    const ventasMensualesData = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [{
            label: 'Ventas Mensuales (S/)',
            data: [12000, 15000, 13500, 18000, 16500, 19000, 21000, 19500, 22000, 24000, 23000, 25000],
            fill: true,
            backgroundColor: 'rgba(102, 126, 234, 0.2)',
            borderColor: 'rgb(102, 126, 234)',
            tension: 0.4,
        }]
    };

    const categoriasData = {
        labels: estadisticas?.productos_mas_vendidos?.slice(0, 5).map(p => p.producto?.categoria) || [],
        datasets: [{
            data: estadisticas?.productos_mas_vendidos?.slice(0, 5).map(() => Math.floor(Math.random() * 100)) || [],
            backgroundColor: [
                'rgba(102, 126, 234, 0.8)',
                'rgba(17, 153, 142, 0.8)',
                'rgba(238, 9, 121, 0.8)',
                'rgba(33, 147, 176, 0.8)',
                'rgba(245, 87, 108, 0.8)',
            ],
        }]
    };

    const utilidadData = {
        labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
        datasets: [
            {
                label: 'Ingresos',
                data: [8000, 9500, 11000, 10500],
                backgroundColor: 'rgba(17, 153, 142, 0.8)',
            },
            {
                label: 'Costos',
                data: [5000, 6000, 7000, 6500],
                backgroundColor: 'rgba(238, 9, 121, 0.8)',
            }
        ]
    };

    return (
        <motion.div
            className="container"
            style={{ marginTop: '20px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="flex-between mb-3">
                <h4 className="page-title">
                    <i className="material-icons">assessment</i>
                    Reportes y Estadísticas
                </h4>

                <div className="input-field" style={{ width: '200px', margin: 0 }}>
                    <select value={filtroTiempo} onChange={(e) => setFiltroTiempo(e.target.value)}>
                        <option value="hoy">Hoy</option>
                        <option value="semana">Esta Semana</option>
                        <option value="mes">Este Mes</option>
                        <option value="año">Este Año</option>
                    </select>
                    <label>Período</label>
                </div>
            </div>

            {/* Métricas Clave */}
            <div className="row">
                <div className="col s12 m6 l3">
                    <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)' }}>
                        <i className="material-icons stat-card-icon" style={{ color: '#667eea' }}>paid</i>
                        <div className="stat-card-value" style={{ color: '#667eea' }}>
                            S/ {estadisticas?.mes?.total?.toFixed(2) || '0.00'}
                        </div>
                        <div className="stat-card-label">Ingresos del Mes</div>
                    </div>
                </div>

                <div className="col s12 m6 l3">
                    <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(17,153,142,0.1) 0%, rgba(56,239,125,0.1) 100%)' }}>
                        <i className="material-icons stat-card-icon" style={{ color: '#11998e' }}>trending_up</i>
                        <div className="stat-card-value" style={{ color: '#11998e' }}>
                            45%
                        </div>
                        <div className="stat-card-label">Margen de Ganancia</div>
                    </div>
                </div>

                <div className="col s12 m6 l3">
                    <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(33,147,176,0.1) 0%, rgba(109, 213,237,0.1) 100%)' }}>
                        <i className="material-icons stat-card-icon" style={{ color: '#2193b0' }}>inventory</i>
                        <div className="stat-card-value" style={{ color: '#2193b0' }}>
                            {productosBajoStock.length}
                        </div>
                        <div className="stat-card-label">Productos Críticos</div>
                    </div>
                </div>

                <div className="col s12 m6 l3">
                    <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(238,9,121,0.1) 0%, rgba(255,106,0,0.1) 100%)' }}>
                        <i className="material-icons stat-card-icon" style={{ color: '#ee0979' }}>people</i>
                        <div className="stat-card-value" style={{ color: '#ee0979' }}>
                            {estadisticas?.hoy?.cantidad_ventas || 0}
                        </div>
                        <div className="stat-card-label">Clientes Atendidos</div>
                    </div>
                </div>
            </div>

            {/* Gráficos */}
            <div className="row">
                <div className="col s12 l8">
                    <div className="card">
                        <div className="card-content">
                            <span className="card-title">
                                <i className="material-icons">show_chart</i>
                                Evolución de Ventas Mensuales
                            </span>
                            <div style={{ height: '350px', position: 'relative' }}>
                                <Line
                                    data={ventasMensualesData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: { legend: { display: false } }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col s12 l4">
                    <div className="card">
                        <div className="card-content">
                            <span className="card-title">
                                <i className="material-icons">category</i>
                                Ventas por Categoría
                            </span>
                            <div style={{ height: '350px', position: 'relative', paddingTop: '20px' }}>
                                <Pie
                                    data={categoriasData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'bottom',
                                                labels: { padding: 10, font: { size: 11 } }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col s12 l6">
                    <div className="card">
                        <div className="card-content">
                            <span className="card-title">
                                <i className="material-icons">account_balance_wallet</i>
                                Análisis de Utilidad
                            </span>
                            <div style={{ height: '300px', position: 'relative' }}>
                                <Bar
                                    data={utilidadData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: { legend: { position: 'bottom' } }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col s12 l6">
                    <div className="card">
                        <div className="card-content">
                            <span className="card-title">
                                <i className="material-icons">warning</i>
                                Productos con Stock Crítico
                            </span>
                            <table className="striped">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Stock</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productosBajoStock.slice(0, 5).map(producto => (
                                        <tr key={producto.id_producto}>
                                            <td>{producto.nombre}</td>
                                            <td>{producto.stock_actual}</td>
                                            <td>
                                                <span className="chip red white-text">Crítico</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Botones de Exportación */}
            <div className="row">
                <div className="col s12">
                    <div className="card">
                        <div className="card-content">
                            <span className="card-title">
                                <i className="material-icons">download</i>
                                Exportar Reportes
                            </span>
                            <div style={{ marginTop: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                <button className="btn blue">
                                    <i className="material-icons left">picture_as_pdf</i>
                                    Exportar a PDF
                                </button>
                                <button className="btn green">
                                    <i className="material-icons left">table_chart</i>
                                    Exportar a Excel
                                </button>
                                <button className="btn orange">
                                    <i className="material-icons left">print</i>
                                    Imprimir Reporte
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Reportes;
