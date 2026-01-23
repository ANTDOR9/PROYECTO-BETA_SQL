import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import M from 'materialize-css';

const Perfil = () => {
    const { usuario } = useAuth();
    const [editando, setEditando] = useState(false);
    const [formData, setFormData] = useState({
        nombre: usuario?.nombre || '',
        email: usuario?.email || '',
        passwordActual: '',
        passwordNuevo: '',
        passwordConfirmar: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí iría la lógica para actualizar el perfil
        M.toast({ html: 'Perfil actualizado exitosamente', classes: 'green' });
        setEditando(false);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    return (
        <motion.div
            className="container"
            style={{ marginTop: '20px' }}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.h4 className="page-title" variants={itemVariants}>
                <i className="material-icons">account_circle</i>
                Mi Perfil
            </motion.h4>

            <div className="row">
                {/* Card de información del usuario */}
                <motion.div variants={itemVariants} className="col s12 l4">
                    <div className="card">
                        <div className="card-content center-align">
                            <div style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '3rem',
                                fontWeight: 'bold',
                                margin: '0 auto 20px',
                                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
                            }}>
                                {usuario?.nombre?.charAt(0).toUpperCase()}
                            </div>
                            <h5 style={{ margin: '0 0 10px' }}>{usuario?.nombre}</h5>
                            <p style={{ color: '#999', margin: '0 0 20px' }}>{usuario?.email}</p>
                            <span className={`chip ${usuario?.rol === 'admin' ? '' : 'blue'} white-text`}
                                style={{ background: usuario?.rol === 'admin' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : undefined }}>
                                {usuario?.rol === 'admin' ? 'Administrador' : 'Vendedor'}
                            </span>

                            <div style={{ marginTop: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '12px' }}>
                                <p style={{ margin: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#666' }}>Miembro desde</span>
                                    <strong>Dic 2024</strong>
                                </p>
                                <p style={{ margin: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#666' }}>Estado</span>
                                    <span className="chip green white-text">Activo</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Card de edición de perfil */}
                <motion.div variants={itemVariants} className="col s12 l8">
                    <div className="card">
                        <div className="card-content">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <span className="card-title">
                                    <i className="material-icons">settings</i>
                                    Configuración del Perfil
                                </span>
                                {!editando && (
                                    <button
                                        className="btn waves-effect waves-light blue"
                                        onClick={() => setEditando(true)}
                                    >
                                        <i className="material-icons left">edit</i>
                                        Editar
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="input-field col s12 m6">
                                        <input
                                            id="nombre"
                                            name="nombre"
                                            type="text"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            disabled={!editando}
                                        />
                                        <label htmlFor="nombre" className="active">Nombre Completo</label>
                                    </div>

                                    <div className="input-field col s12 m6">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={!editando}
                                        />
                                        <label htmlFor="email" className="active">Correo Electrónico</label>
                                    </div>
                                </div>

                                {editando && (
                                    <>
                                        <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '20px', marginTop: '20px' }}>
                                            <h6 style={{ marginBottom: '20px', color: '#667eea' }}>
                                                <i className="material-icons" style={{ verticalAlign: 'middle', marginRight: '8px' }}>lock</i>
                                                Cambiar Contraseña
                                            </h6>

                                            <div className="row">
                                                <div className="input-field col s12">
                                                    <input
                                                        id="passwordActual"
                                                        name="passwordActual"
                                                        type="password"
                                                        value={formData.passwordActual}
                                                        onChange={handleChange}
                                                    />
                                                    <label htmlFor="passwordActual">Contraseña Actual</label>
                                                </div>

                                                <div className="input-field col s12 m6">
                                                    <input
                                                        id="passwordNuevo"
                                                        name="passwordNuevo"
                                                        type="password"
                                                        value={formData.passwordNuevo}
                                                        onChange={handleChange}
                                                    />
                                                    <label htmlFor="passwordNuevo">Nueva Contraseña</label>
                                                </div>

                                                <div className="input-field col s12 m6">
                                                    <input
                                                        id="passwordConfirmar"
                                                        name="passwordConfirmar"
                                                        type="password"
                                                        value={formData.passwordConfirmar}
                                                        onChange={handleChange}
                                                    />
                                                    <label htmlFor="passwordConfirmar">Confirmar Contraseña</label>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ marginTop: '20px' }}>
                                            <button type="submit" className="btn waves-effect waves-light teal">
                                                <i className="material-icons left">save</i>
                                                Guardar Cambios
                                            </button>
                                            <button
                                                type="button"
                                                className="btn waves-effect waves-light grey"
                                                onClick={() => {
                                                    setEditando(false);
                                                    setFormData({
                                                        ...formData,
                                                        passwordActual: '',
                                                        passwordNuevo: '',
                                                        passwordConfirmar: ''
                                                    });
                                                }}
                                                style={{ marginLeft: '10px' }}
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Card de preferencias */}
                    <div className="card">
                        <div className="card-content">
                            <span className="card-title">
                                <i className="material-icons">tune</i>
                                Preferencias
                            </span>

                            <div style={{ marginTop: '20px' }}>
                                <p style={{ marginBottom: '15px' }}>
                                    <label>
                                        <input type="checkbox" defaultChecked />
                                        <span>Recibir notificaciones de stock bajo</span>
                                    </label>
                                </p>
                                <p style={{ marginBottom: '15px' }}>
                                    <label>
                                        <input type="checkbox" defaultChecked />
                                        <span>Recibir notificaciones de productos próximos a vencer</span>
                                    </label>
                                </p>
                                <p style={{ marginBottom: '15px' }}>
                                    <label>
                                        <input type="checkbox" />
                                        <span>Modo oscuro (próximamente)</span>
                                    </label>
                                </p>
                                <p style={{ marginBottom: '15px' }}>
                                    <label>
                                        <input type="checkbox" defaultChecked />
                                        <span>Mostrar tutorial al iniciar</span>
                                    </label>
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Perfil;
