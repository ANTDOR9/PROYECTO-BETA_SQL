import React, { useState, useEffect } from 'react';
import api from '../api/axios.config';
import Loading from '../components/common/Loading';
import M from 'materialize-css';

const Alertas = () => {
    const [alertas, setAlertas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [generando, setGenerando] = useState(false);
    const [filtro, setFiltro] = useState('todas');

    useEffect(() => {
        cargarAlertas();
    }, []);

    const cargarAlertas = async () => {
        try {
            const response = await api.get('/alertas');
            if (response.data.success) {
                setAlertas(response.data.data);
                const noLeidas = response.data.data.filter(a => !a.leida).length;
                const badge = document.getElementById('alert-count');
                if (badge) badge.textContent = noLeidas;
            }
        } catch (error) {
            M.toast({ html: 'Error al cargar alertas', classes: 'red' });
        } finally {
            setCargando(false);
        }
    };

    const generarAlertas = async () => {
        setGenerando(true);
        try {
            const response = await api.post('/alertas/generar');
            if (response.data.success) {
                M.toast({
                    html: `✅ ${response.data.alertasCreadas || 0} alertas generadas`,
                    classes: 'green',
                    displayLength: 4000
                });
                cargarAlertas();
            }
        } catch (error) {
            M.toast({ html: 'Error al generar alertas', classes: 'red' });
        } finally {
            setGenerando(false);
        }
    };

    const marcarLeida = async (id) => {
        try {
            await api.put(`/alertas/${id}/marcar-leida`);
            cargarAlertas();
            M.toast({ html: 'Alerta marcada como leída', classes: 'green' });
        } catch (error) {
            M.toast({ html: 'Error al actualizar alerta', classes: 'red' });
        }
    };

    const eliminarAlerta = async (id) => {
        if (window.confirm('¿Está seguro de eliminar esta alerta?')) {
            try {
                await api.delete(`/alertas/${id}`);
                cargarAlertas();
                M.toast({ html: 'Alerta eliminada', classes: 'green' });
            } catch (error) {
                M.toast({ html: 'Error al eliminar alerta', classes: 'red' });
            }
        }
    };

    const marcarTodasLeidas = async () => {
        try {
            const alertasNoLeidas = alertas.filter(a => !a.leida);
            for (const alerta of alertasNoLeidas) {
                await api.put(`/alertas/${alerta.id_alerta}/marcar-leida`);
            }
            M.toast({ html: 'Todas las alertas marcadas como leídas', classes: 'green' });
            cargarAlertas();
        } catch (error) {
            M.toast({ html: 'Error al marcar alertas', classes: 'red' });
        }
    };

    const alertasFiltradas = alertas.filter(alerta => {
        if (filtro === 'todas') return true;
        if (filtro === 'no_leidas') return !alerta.leida;
        if (filtro === 'leidas') return alerta.leida;
        return true;
    });

    const alertasPorTipo = {
        stock_bajo: alertas.filter(a => a.tipo === 'stock_bajo' && !a.leida).length,
        vencido: alertas.filter(a => a.tipo === 'producto_vencido' && !a.leida).length
    };

    if (cargando) {
        return <Loading />;
    }

    return (
        <div className="container" style={{ marginTop: '20px' }}>
            <div className="flex-between mb-3">
                <h4 className="page-title">
                    <i className="material-icons">notifications</i>
                    Alertas del Sistema
                </h4>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={generarAlertas}
                        className="btn waves-effect waves-light teal"
                        disabled={generando}
                    >
                        <i className="material-icons left">refresh</i>
                        {generando ? 'Generando...' : 'Generar Alertas'}
                    </button>
                    {alertas.filter(a => !a.leida).length > 0 && (
                        <button
                            onClick={marcarTodasLeidas}
                            className="btn waves-effect waves-light blue"
                        >
                            <i className="material-icons left">done_all</i>
                            Marcar Todas
                        </button>
                    )}
                </div>
            </div>

            {/* Resumen de alertas */}
            <div className="row">
                <div className="col s12 m6">
                    <div className="card orange lighten-5">
                        <div className="card-content center-align">
                            <i className="material-icons orange-text" style={{ fontSize: '3rem' }}>inventory</i>
                            <h5 className="orange-text">{alertasPorTipo.stock_bajo}</h5>
                            <p>Productos con Stock Bajo</p>
                        </div>
                    </div>
                </div>
                <div className="col s12 m6">
                    <div className="card red lighten-5">
                        <div className="card-content center-align">
                            <i className="material-icons red-text" style={{ fontSize: '3rem' }}>event_busy</i>
                            <h5 className="red-text">{alertasPorTipo.vencido}</h5>
                            <p>Productos Próximos a Vencer</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <div className="card">
                <div className="card-content">
                    <div className="chip" onClick={() => setFiltro('todas')} style={{ cursor: 'pointer', backgroundColor: filtro === 'todas' ? '#26a69a' : '#e0e0e0', color: filtro === 'todas' ? 'white' : 'black' }}>
                        Todas ({alertas.length})
                    </div>
                    <div className="chip" onClick={() => setFiltro('no_leidas')} style={{ cursor: 'pointer', marginLeft: '10px', backgroundColor: filtro === 'no_leidas' ? '#26a69a' : '#e0e0e0', color: filtro === 'no_leidas' ? 'white' : 'black' }}>
                        No Leídas ({alertas.filter(a => !a.leida).length})
                    </div>
                    <div className="chip" onClick={() => setFiltro('leidas')} style={{ cursor: 'pointer', marginLeft: '10px', backgroundColor: filtro === 'leidas' ? '#26a69a' : '#e0e0e0', color: filtro === 'leidas' ? 'white' : 'black' }}>
                        Leídas ({alertas.filter(a => a.leida).length})
                    </div>
                </div>
            </div>

            {/* Lista de alertas */}
            <div className="card">
                <div className="card-content">
                    <span className="card-title">Alertas ({alertasFiltradas.length})</span>

                    {alertasFiltradas.length > 0 ? (
                        <div>
                            {alertasFiltradas.map(alerta => (
                                <div
                                    key={alerta.id_alerta}
                                    className={`alert-item ${alerta.leida ? 'leida' : ''}`}
                                    style={{
                                        padding: '15px',
                                        marginBottom: '10px',
                                        borderRadius: '8px',
                                        borderLeft: `4px solid ${alerta.tipo === 'stock_bajo' ? '#ff9800' : '#f44336'}`,
                                        backgroundColor: alerta.leida ? '#fafafa' : (alerta.tipo === 'stock_bajo' ? '#fff3e0' : '#ffebee')
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                                <i className="material-icons" style={{ marginRight: '10px', color: alerta.tipo === 'stock_bajo' ? '#ff9800' : '#f44336' }}>
                                                    {alerta.tipo === 'stock_bajo' ? 'inventory' : 'event_busy'}
                                                </i>
                                                <span className="chip" style={{ marginRight: '10px' }}>
                                                    {alerta.tipo === 'stock_bajo' ? 'Stock Bajo' : 'Próximo a Vencer'}
                                                </span>
                                                {alerta.leida && <span className="chip grey">Leída</span>}
                                            </div>

                                            <strong style={{ fontSize: '1.1rem' }}>{alerta.producto?.nombre}</strong>
                                            <p style={{ margin: '5px 0', color: '#666' }}>{alerta.mensaje}</p>
                                            <small className="grey-text">
                                                {new Date(alerta.fecha_alerta).toLocaleString('es-ES')}
                                            </small>
                                        </div>

                                        <div style={{ display: 'flex', gap: '5px', marginLeft: '15px' }}>
                                            {!alerta.leida && (
                                                <button
                                                    className="btn-small waves-effect waves-light blue"
                                                    onClick={() => marcarLeida(alerta.id_alerta)}
                                                    title="Marcar como leída"
                                                >
                                                    <i className="material-icons">done</i>
                                                </button>
                                            )}
                                            <button
                                                className="btn-small waves-effect waves-light red"
                                                onClick={() => eliminarAlerta(alerta.id_alerta)}
                                                title="Eliminar"
                                            >
                                                <i className="material-icons">delete</i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="center-align" style={{ padding: '40px 0' }}>
                            <i className="material-icons large green-text">check_circle</i>
                            <p className="grey-text">No hay alertas para mostrar</p>
                            <button
                                onClick={generarAlertas}
                                className="btn waves-effect waves-light teal mt-2"
                                disabled={generando}
                            >
                                <i className="material-icons left">refresh</i>
                                Generar Alertas Ahora
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Alertas;
