import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { usuario } = useAuth();
    const location = useLocation();

    // No mostrar sidebar en login
    if (location.pathname === '/login') {
        return null;
    }

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path);
    };

    return (
        <div className="sidebar">
            <div className="sidebar-nav">
                <div className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
                    <Link to="/dashboard">
                        <i className="material-icons">dashboard</i>
                        Dashboard
                    </Link>
                </div>

                <div className={`nav-item ${isActive('/productos') ? 'active' : ''}`}>
                    <Link to="/productos">
                        <i className="material-icons">inventory_2</i>
                        Productos
                    </Link>
                </div>

                <div className={`nav-item ${isActive('/ventas') ? 'active' : ''}`}>
                    <Link to="/ventas">
                        <i className="material-icons">point_of_sale</i>
                        Nueva Venta
                    </Link>
                </div>

                <div className={`nav-item ${isActive('/clientes') ? 'active' : ''}`}>
                    <Link to="/clientes">
                        <i className="material-icons">people</i>
                        Clientes
                    </Link>
                </div>

                <div className={`nav-item ${isActive('/reportes') ? 'active' : ''}`}>
                    <Link to="/reportes">
                        <i className="material-icons">assessment</i>
                        Reportes
                    </Link>
                </div>

                <div className={`nav-item ${isActive('/alertas') ? 'active' : ''}`}>
                    <Link to="/alertas">
                        <i className="material-icons">notifications</i>
                        Alertas
                    </Link>
                </div>

                {usuario?.rol === 'admin' && (
                    <>
                        <div style={{ margin: '20px 15px 10px', borderTop: '1px solid #e0e0e0', paddingTop: '10px' }}>
                            <p style={{ fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>
                                Administración
                            </p>
                        </div>
                        <div className={`nav-item ${isActive('/usuarios') ? 'active' : ''}`}>
                            <Link to="/usuarios">
                                <i className="material-icons">manage_accounts</i>
                                Usuarios
                            </Link>
                        </div>
                    </>
                )}
            </div>

            {/* Información del usuario en el footer del sidebar */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '20px',
                background: 'linear-gradient(135deg, rgba(102,126,234,0.05) 0%, rgba(118,75,162,0.05) 100%)',
                borderTop: '1px solid rgba(102,126,234,0.2)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        marginRight: '12px',
                        fontSize: '1.2rem'
                    }}>
                        {usuario?.nombre?.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {usuario?.nombre}
                        </p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#999' }}>
                            {usuario?.rol === 'admin' ? 'Administrador' : 'Vendedor'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
