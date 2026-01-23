import React, { useState, useEffect } from 'react';
import api from '../api/axios.config';
import Loading from '../components/common/Loading';
import M from 'materialize-css';
import { motion } from 'framer-motion';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [usuarioEditando, setUsuarioEditando] = useState(null);
    const [guardando, setGuardando] = useState(false);
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        rol: 'vendedor'
    });

    useEffect(() => {
        cargarUsuarios();
    }, []);

    useEffect(() => {
        const modals = document.querySelectorAll('.modal');
        M.Modal.init(modals);
        const selects = document.querySelectorAll('select');
        M.FormSelect.init(selects);
        M.updateTextFields();
    }, [usuarioEditando, usuarios]);

    const cargarUsuarios = async () => {
        try {
            const response = await api.get('/usuarios');
            if (response.data.success) {
                setUsuarios(response.data.data);
            }
        } catch (error) {
            M.toast({ html: 'Error al cargar usuarios', classes: 'red' });
        } finally {
            setCargando(false);
        }
    };

    const abrirModal = (usuario = null) => {
        if (usuario) {
            setUsuarioEditando(usuario.id_usuario);
            setFormData({
                nombre: usuario.nombre,
                email: usuario.email,
                password: '',
                rol: usuario.rol
            });
        } else {
            setUsuarioEditando(null);
            setFormData({
                nombre: '',
                email: '',
                password: '',
                rol: 'vendedor'
            });
        }
        setMostrarPassword(false);
        setTimeout(() => {
            const modal = M.Modal.getInstance(document.getElementById('modalUsuario'));
            modal.open();
            M.updateTextFields();
            const selects = document.querySelectorAll('select');
            M.FormSelect.init(selects);
        }, 100);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones
        if (!formData.nombre || !formData.email) {
            M.toast({ html: 'Nombre y email son requeridos', classes: 'orange' });
            return;
        }

        if (!usuarioEditando && !formData.password) {
            M.toast({ html: 'La contraseña es requerida para nuevos usuarios', classes: 'orange' });
            return;
        }

        if (formData.password && formData.password.length < 6) {
            M.toast({ html: 'La contraseña debe tener al menos 6 caracteres', classes: 'orange' });
            return;
        }

        setGuardando(true);

        try {
            const dataToSend = { ...formData };
            if (!dataToSend.password) {
                delete dataToSend.password;
            }

            if (usuarioEditando) {
                await api.put(`/usuarios/${usuarioEditando}`, dataToSend);
                M.toast({ html: '✅ Usuario actualizado exitosamente', classes: 'green', displayLength: 4000 });
            } else {
                await api.post('/usuarios', dataToSend);
                M.toast({ html: '✅ Usuario creado exitosamente. Ya puede iniciar sesión.', classes: 'green', displayLength: 5000 });
            }

            const modal = M.Modal.getInstance(document.getElementById('modalUsuario'));
            modal.close();
            cargarUsuarios();
        } catch (error) {
            M.toast({
                html: error.response?.data?.message || 'Error al guardar usuario',
                classes: 'red'
            });
        } finally {
            setGuardando(false);
        }
    };

    const eliminarUsuario = async (id) => {
        if (window.confirm('¿Está seguro de desactivar este usuario?')) {
            try {
                await api.delete(`/usuarios/${id}`);
                M.toast({ html: 'Usuario desactivado exitosamente', classes: 'green' });
                cargarUsuarios();
            } catch (error) {
                M.toast({ html: 'Error al desactivar usuario', classes: 'red' });
            }
        }
    };

    if (cargando) {
        return <Loading />;
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
    };

    return (
        <motion.div
            className="container"
            style={{ marginTop: '20px' }}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div variants={itemVariants} className="flex-between mb-3">
                <h4 className="page-title">
                    <i className="material-icons">manage_accounts</i>
                    Gestión de Usuarios
                </h4>
                <button onClick={() => abrirModal()} className="btn waves-effect waves-light teal">
                    <i className="material-icons left">person_add</i>
                    Nuevo Usuario
                </button>
            </motion.div>

            {/* Estadísticas */}
            <motion.div variants={itemVariants} className="row">
                <div className="col s12 m4">
                    <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)' }}>
                        <i className="material-icons stat-card-icon" style={{ color: '#667eea' }}>people</i>
                        <div className="stat-card-value" style={{ color: '#667eea' }}>{usuarios.length}</div>
                        <div className="stat-card-label">Total Usuarios</div>
                    </div>
                </div>
                <div className="col s12 m4">
                    <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(17,153,142,0.1) 0%, rgba(56,239,125,0.1) 100%)' }}>
                        <i className="material-icons stat-card-icon" style={{ color: '#11998e' }}>admin_panel_settings</i>
                        <div className="stat-card-value" style={{ color: '#11998e' }}>
                            {usuarios.filter(u => u.rol === 'admin').length}
                        </div>
                        <div className="stat-card-label">Administradores</div>
                    </div>
                </div>
                <div className="col s12 m4">
                    <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(33,147,176,0.1) 0%, rgba(109,213,237,0.1) 100%)' }}>
                        <i className="material-icons stat-card-icon" style={{ color: '#2193b0' }}>point_of_sale</i>
                        <div className="stat-card-value" style={{ color: '#2193b0' }}>
                            {usuarios.filter(u => u.rol === 'vendedor').length}
                        </div>
                        <div className="stat-card-label">Vendedores</div>
                    </div>
                </div>
            </motion.div>

            {/* Lista de usuarios */}
            <motion.div variants={itemVariants} className="card">
                <div className="card-content">
                    <span className="card-title">
                        <i className="material-icons">list</i>
                        Lista de Usuarios ({usuarios.length})
                    </span>

                    {usuarios.length > 0 ? (
                        <table className="striped highlight">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Rol</th>
                                    <th>Estado</th>
                                    <th className="center-align">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map(usuario => (
                                    <tr key={usuario.id_usuario}>
                                        <td>#{usuario.id_usuario}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div style={{
                                                    width: '35px',
                                                    height: '35px',
                                                    borderRadius: '50%',
                                                    background: usuario.rol === 'admin'
                                                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                                        : 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    marginRight: '10px',
                                                    fontSize: '0.9rem'
                                                }}>
                                                    {usuario.nombre.charAt(0).toUpperCase()}
                                                </div>
                                                <strong>{usuario.nombre}</strong>
                                            </div>
                                        </td>
                                        <td>{usuario.email}</td>
                                        <td>
                                            <span className={`chip ${usuario.rol === 'admin' ? '' : 'blue'} white-text`}
                                                style={{ background: usuario.rol === 'admin' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : undefined }}>
                                                {usuario.rol === 'admin' ? 'Administrador' : 'Vendedor'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`chip ${usuario.activo ? 'green' : 'grey'} white-text`}>
                                                {usuario.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="center-align">
                                            <button
                                                onClick={() => abrirModal(usuario)}
                                                className="btn-small waves-effect waves-light blue"
                                                style={{ marginRight: '5px' }}
                                            >
                                                <i className="material-icons">edit</i>
                                            </button>
                                            <button
                                                onClick={() => eliminarUsuario(usuario.id_usuario)}
                                                className="btn-small waves-effect waves-light red"
                                                disabled={usuario.rol === 'admin' && usuarios.filter(u => u.rol === 'admin' && u.activo).length <= 1}
                                            >
                                                <i className="material-icons">person_off</i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="center-align" style={{ padding: '40px 0' }}>
                            <i className="material-icons large grey-text">people_outline</i>
                            <p className="grey-text">No hay usuarios registrados</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Modal para agregar/editar usuario */}
            <div id="modalUsuario" className="modal">
                <div className="modal-content">
                    <h5 style={{ display: 'flex', alignItems: 'center' }}>
                        <i className="material-icons" style={{ marginRight: '10px' }}>
                            {usuarioEditando ? 'edit' : 'person_add'}
                        </i>
                        {usuarioEditando ? 'Editar Usuario' : 'Nuevo Usuario'}
                    </h5>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="input-field col s12">
                                <i className="material-icons prefix">person</i>
                                <input
                                    id="nombre"
                                    name="nombre"
                                    type="text"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="nombre" className={formData.nombre ? 'active' : ''}>Nombre Completo *</label>
                            </div>
                        </div>

                        <div className="row">
                            <div className="input-field col s12">
                                <i className="material-icons prefix">email</i>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="email" className={formData.email ? 'active' : ''}>Correo Electrónico *</label>
                            </div>
                        </div>

                        <div className="row">
                            <div className="input-field col s12">
                                <i className="material-icons prefix">lock</i>
                                <input
                                    id="password"
                                    name="password"
                                    type={mostrarPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    required={!usuarioEditando}
                                />
                                <label htmlFor="password" className={formData.password ? 'active' : ''}>
                                    {usuarioEditando ? 'Nueva Contraseña (dejar vacío para mantener)' : 'Contraseña *'}
                                </label>
                                <span
                                    onClick={() => setMostrarPassword(!mostrarPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '15px',
                                        cursor: 'pointer',
                                        color: '#667eea'
                                    }}
                                >
                                    <i className="material-icons">
                                        {mostrarPassword ? 'visibility_off' : 'visibility'}
                                    </i>
                                </span>
                            </div>
                        </div>

                        <div className="row">
                            <div className="input-field col s12">
                                <i className="material-icons prefix">badge</i>
                                <select
                                    id="rol"
                                    name="rol"
                                    value={formData.rol}
                                    onChange={handleChange}
                                >
                                    <option value="vendedor">Vendedor</option>
                                    <option value="admin">Administrador</option>
                                </select>
                                <label>Rol del Usuario</label>
                            </div>
                        </div>

                        <div className="modal-footer" style={{ paddingTop: '20px' }}>
                            <button
                                type="button"
                                className="modal-close btn-flat waves-effect waves-teal"
                                disabled={guardando}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn waves-effect waves-light teal"
                                disabled={guardando}
                            >
                                {guardando ? 'Guardando...' : (usuarioEditando ? 'Actualizar' : 'Crear Usuario')}
                                <i className="material-icons right">{usuarioEditando ? 'save' : 'person_add'}</i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default Usuarios;
