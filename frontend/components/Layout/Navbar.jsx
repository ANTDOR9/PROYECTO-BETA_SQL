import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import M from 'materialize-css';

const Navbar = () => {
    const { usuario, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Inicializar dropdown y sidenav
        const dropdowns = document.querySelectorAll('.dropdown-trigger');
        M.Dropdown.init(dropdowns, {
            coverTrigger: false,
            constrainWidth: false
        });

        const sidenavs = document.querySelectorAll('.sidenav');
        M.Sidenav.init(sidenavs);
    }, []);

    const handleLogout = () => {
        M.toast({ html: 'Sesión cerrada exitosamente', classes: 'green' });
        logout();
        setTimeout(() => {
            navigate('/login');
        }, 500);
    };

    // No mostrar navbar en login
    if (location.pathname === '/login') {
        return null;
    }

    return (
        <>
            {/* Navbar principal */}
            <div className="navbar-fixed">
                <nav>
                    <div className="nav-wrapper">
                        <a href="#!" data-target="mobile-nav" className="sidenav-trigger">
                            <i className="material-icons">menu</i>
                        </a>
                        <Link to="/dashboard" className="brand-logo">
                            <i className="material-icons left">local_pharmacy</i>
                            Nova Salud
                        </Link>
                        <ul className="right hide-on-med-and-down">
                            <li>
                                <Link to="/alertas">
                                    <div className="alert-badge">
                                        <i className="material-icons">notifications</i>
                                        <span className="alert-count" id="alert-count">0</span>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <a className="dropdown-trigger" href="#!" data-target="dropdown-user">
                                    <i className="material-icons left">account_circle</i>
                                    {usuario?.nombre}
                                    <i className="material-icons right">arrow_drop_down</i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>

            {/* Dropdown usuario */}
            <ul id="dropdown-user" className="dropdown-content">
                <li>
                    <a href="#!">
                        <i className="material-icons">person</i>
                        {usuario?.email}
                    </a>
                </li>
                <li className="divider"></li>
                <li>
                    <a href="#!" onClick={handleLogout}>
                        <i className="material-icons">exit_to_app</i>
                        Cerrar Sesión
                    </a>
                </li>
            </ul>

            {/* Sidenav móvil */}
            <ul className="sidenav" id="mobile-nav">
                <li>
                    <div className="user-view">
                        <div className="background teal darken-1"></div>
                        <a href="#!"><span className="white-text name">{usuario?.nombre}</span></a>
                        <a href="#!"><span className="white-text email">{usuario?.email}</span></a>
                    </div>
                </li>
                <li><Link to="/dashboard"><i className="material-icons">dashboard</i>Dashboard</Link></li>
                <li><Link to="/productos"><i className="material-icons">inventory_2</i>Productos</Link></li>
                <li><Link to="/ventas"><i className="material-icons">point_of_sale</i>Ventas</Link></li>
                <li><Link to="/clientes"><i className="material-icons">people</i>Clientes</Link></li>
                <li><Link to="/alertas"><i className="material-icons">notifications</i>Alertas</Link></li>
                {usuario?.rol === 'admin' && (
                    <li><Link to="/usuarios"><i className="material-icons">manage_accounts</i>Usuarios</Link></li>
                )}
                <li><div className="divider"></div></li>
                <li><a href="#!" onClick={handleLogout}><i className="material-icons">exit_to_app</i>Cerrar Sesión</a></li>
            </ul>
        </>
    );
};

export default Navbar;
