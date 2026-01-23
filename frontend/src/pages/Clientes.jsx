import React, { useState, useEffect } from 'react';
import api from '../api/axios.config';
import Loading from '../components/common/Loading';
import M from 'materialize-css';

const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState('');
    const [clienteEditando, setClienteEditando] = useState(null);
    const [guardando, setGuardando] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        dni: '',
        telefono: '',
        email: '',
        direccion: ''
    });

    useEffect(() => {
        cargarClientes();
    }, []);

    useEffect(() => {
        const modals = document.querySelectorAll('.modal');
        M.Modal.init(modals);
        M.updateTextFields();
    }, [clienteEditando]);

    const cargarClientes = async () => {
        try {
            const response = await api.get('/clientes');
            if (response.data.success) {
                setClientes(response.data.data);
            }
        } catch (error) {
            M.toast({ html: 'Error al cargar clientes', classes: 'red' });
        } finally {
            setCargando(false);
        }
    };

    const abrirModal = (cliente = null) => {
        if (cliente) {
            setClienteEditando(cliente.id_cliente);
            setFormData(cliente);
        } else {
            setClienteEditando(null);
            setFormData({
                nombre: '',
                apellido: '',
                dni: '',
                telefono: '',
                email: '',
                direccion: ''
            });
        }
        const modal = M.Modal.getInstance(document.getElementById('modalCliente'));
        modal.open();
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGuardando(true);

        try {
            if (clienteEditando) {
                await api.put(`/clientes/${clienteEditando}`, formData);
                M.toast({ html: 'Cliente actualizado exitosamente', classes: 'green' });
            } else {
                await api.post('/clientes', formData);
                M.toast({ html: 'Cliente creado exitosamente', classes: 'green' });
            }

            const modal = M.Modal.getInstance(document.getElementById('modalCliente'));
            modal.close();
            cargarClientes();
        } catch (error) {
            M.toast({
                html: error.response?.data?.message || 'Error al guardar cliente',
                classes: 'red'
            });
        } finally {
            setGuardando(false);
        }
    };

    const eliminarCliente = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este cliente?')) {
            try {
                await api.delete(`/clientes/${id}`);
                M.toast({ html: 'Cliente eliminado exitosamente', classes: 'green' });
                cargarClientes();
            } catch (error) {
                M.toast({ html: 'Error al eliminar cliente', classes: 'red' });
            }
        }
    };

    const clientesFiltrados = clientes.filter(cliente =>
        `${cliente.nombre} ${cliente.apellido}`.toLowerCase().includes(busqueda.toLowerCase()) ||
        cliente.dni?.toLowerCase().includes(busqueda.toLowerCase()) ||
        cliente.email?.toLowerCase().includes(busqueda.toLowerCase())
    );

    if (cargando) {
        return <Loading />;
    }

    return (
        <div className="container" style={{ marginTop: '20px' }}>
            <div className="flex-between mb-3">
                <h4 className="page-title">
                    <i className="material-icons left">people</i>
                    Clientes
                </h4>
                <button onClick={() => abrirModal()} className="btn waves-effect waves-light teal">
                    <i className="material-icons left">person_add</i>
                    Nuevo Cliente
                </button>
            </div>

            {/* Búsqueda */}
            <div className="card">
                <div className="card-content">
                    <div className="input-field">
                        <i className="material-icons prefix">search</i>
                        <input
                            id="busqueda"
                            type="text"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                        <label htmlFor="busqueda">Buscar por nombre, DNI o email</label>
                    </div>
                </div>
            </div>

            {/* Lista de clientes */}
            <div className="card">
                <div className="card-content">
                    <span className="card-title">Lista de Clientes ({clientesFiltrados.length})</span>

                    {clientesFiltrados.length > 0 ? (
                        <table className="striped highlight responsive-table">
                            <thead>
                                <tr>
                                    <th>DNI</th>
                                    <th>Nombre Completo</th>
                                    <th>Teléfono</th>
                                    <th>Email</th>
                                    <th className="center-align">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientesFiltrados.map(cliente => (
                                    <tr key={cliente.id_cliente}>
                                        <td>{cliente.dni || 'N/A'}</td>
                                        <td>
                                            <strong>{cliente.nombre} {cliente.apellido}</strong>
                                        </td>
                                        <td>{cliente.telefono || 'N/A'}</td>
                                        <td>{cliente.email || 'N/A'}</td>
                                        <td className="center-align">
                                            <button
                                                onClick={() => abrirModal(cliente)}
                                                className="btn-small waves-effect waves-light blue"
                                                style={{ marginRight: '5px' }}
                                            >
                                                <i className="material-icons">edit</i>
                                            </button>
                                            <button
                                                onClick={() => eliminarCliente(cliente.id_cliente)}
                                                className="btn-small waves-effect waves-light red"
                                            >
                                                <i className="material-icons">delete</i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="center-align" style={{ padding: '40px 0' }}>
                            <i className="material-icons large grey-text">people</i>
                            <p className="grey-text">No se encontraron clientes</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal para agregar/editar cliente */}
            <div id="modalCliente" className="modal">
                <div className="modal-content">
                    <h5>{clienteEditando ? 'Editar Cliente' : 'Nuevo Cliente'}</h5>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="input-field col s12 m6">
                                <input
                                    id="nombre"
                                    name="nombre"
                                    type="text"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="nombre">Nombre *</label>
                            </div>
                            <div className="input-field col s12 m6">
                                <input
                                    id="apellido"
                                    name="apellido"
                                    type="text"
                                    value={formData.apellido}
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="apellido">Apellido *</label>
                            </div>
                        </div>

                        <div className="row">
                            <div className="input-field col s12 m6">
                                <input
                                    id="dni"
                                    name="dni"
                                    type="text"
                                    value={formData.dni}
                                    onChange={handleChange}
                                />
                                <label htmlFor="dni">DNI</label>
                            </div>
                            <div className="input-field col s12 m6">
                                <input
                                    id="telefono"
                                    name="telefono"
                                    type="text"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                />
                                <label htmlFor="telefono">Teléfono</label>
                            </div>
                        </div>

                        <div className="row">
                            <div className="input-field col s12">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                <label htmlFor="email">Email</label>
                            </div>
                        </div>

                        <div className="row">
                            <div className="input-field col s12">
                                <textarea
                                    id="direccion"
                                    name="direccion"
                                    className="materialize-textarea"
                                    value={formData.direccion}
                                    onChange={handleChange}
                                ></textarea>
                                <label htmlFor="direccion">Dirección</label>
                            </div>
                        </div>

                        <div className="modal-footer">
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
                                {guardando ? 'Guardando...' : 'Guardar'}
                                <i className="material-icons right">save</i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Clientes;
