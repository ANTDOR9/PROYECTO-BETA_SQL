import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import M from 'materialize-css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cargando, setCargando] = useState(false);
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            M.toast({ html: 'Por favor complete todos los campos', classes: 'red' });
            return;
        }

        setCargando(true);
        const resultado = await login(email, password);
        setCargando(false);

        if (resultado.success) {
            M.toast({ html: 'Inicio de sesión exitoso', classes: 'green' });
            navigate('/dashboard');
        } else {
            M.toast({ html: resultado.message, classes: 'red' });
        }
    };

    return (
        <div className="login-container">
            <div className="card login-card">
                <div className="login-header">
                    <i className="material-icons login-icon">local_pharmacy</i>
                    <h4>Nova Salud</h4>
                    <p>Sistema de Gestión de Inventario y Ventas</p>
                </div>

                <div className="card-content">
                    <form onSubmit={handleSubmit}>
                        <div className="input-field">
                            <i className="material-icons prefix">email</i>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={cargando}
                            />
                            <label htmlFor="email">Correo Electrónico</label>
                        </div>

                        <div className="input-field" style={{ position: 'relative' }}>
                            <i className="material-icons prefix">lock</i>
                            <input
                                id="password"
                                type={mostrarPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={cargando}
                            />
                            <label htmlFor="password">Contraseña</label>
                            <i
                                className="material-icons"
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '15px',
                                    cursor: 'pointer',
                                    color: '#9e9e9e',
                                    userSelect: 'none'
                                }}
                                onClick={() => setMostrarPassword(!mostrarPassword)}
                                title={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            >
                                {mostrarPassword ? 'visibility_off' : 'visibility'}
                            </i>
                        </div>

                        <button
                            type="submit"
                            className="btn waves-effect waves-light full-width teal darken-1"
                            disabled={cargando}
                        >
                            {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                            <i className="material-icons right">send</i>
                        </button>
                    </form>

                    <div className="mt-3" style={{ borderTop: '1px solid #e0e0e0', paddingTop: '20px' }}>
                        <p className="center-align" style={{ fontSize: '0.9rem', color: '#9e9e9e' }}>
                            <strong>Usuarios de prueba:</strong>
                        </p>
                        <p className="center-align" style={{ fontSize: '0.85rem', marginTop: '10px' }}>
                            <strong>Admin:</strong> admin@novasalud.com
                            <br />
                            <strong>Vendedor:</strong> vendedor@novasalud.com
                            <br />
                            <strong>Contraseña:</strong> Admin123!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
