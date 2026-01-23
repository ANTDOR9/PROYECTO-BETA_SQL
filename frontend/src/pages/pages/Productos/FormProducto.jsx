import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios.config';
import Loading from '../../components/common/Loading';
import M from 'materialize-css';

const FormProducto = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const esEdicion = !!id;

    const [cargando, setCargando] = useState(esEdicion);
    const [guardando, setGuardando] = useState(false);
    const [producto, setProducto] = useState({
        nombre: '',
        descripcion: '',
        codigo_barras: '',
        categoria: '',
        precio_compra: '',
        precio_venta: '',
        stock_actual: '',
        stock_minimo: '10',
        fecha_vencimiento: '',
        laboratorio: '',
        activo: true
    });

    useEffect(() => {
        if (esEdicion) {
            cargarProducto();
        }
    }, [id]);

    useEffect(() => {
        // Actualizar labels de Materialize
        M.updateTextFields();

        // Inicializar select
        const selects = document.querySelectorAll('select');
        M.FormSelect.init(selects);
    }, [producto]);

    const cargarProducto = async () => {
        try {
            const response = await api.get(`/productos/${id}`);
            if (response.data.success) {
                setProducto(response.data.data);
            }
        } catch (error) {
            M.toast({ html: 'Error al cargar producto', classes: 'red' });
            navigate('/productos');
        } finally {
            setCargando(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProducto(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones
        if (!producto.nombre || !producto.categoria || !producto.precio_venta) {
            M.toast({ html: 'Por favor complete los campos requeridos', classes: 'orange' });
            return;
        }

        setGuardando(true);
        try {
            if (esEdicion) {
                await api.put(`/productos/${id}`, producto);
                M.toast({ html: 'Producto actualizado exitosamente', classes: 'green' });
            } else {
                await api.post('/productos', producto);
                M.toast({ html: 'Producto creado exitosamente', classes: 'green' });
            }
            navigate('/productos');
        } catch (error) {
            M.toast({
                html: error.response?.data?.message || 'Error al guardar producto',
                classes: 'red'
            });
        } finally {
            setGuardando(false);
        }
    };

    if (cargando) {
        return <Loading />;
    }

    return (
        <div className="container" style={{ marginTop: '20px' }}>
            <h4 className="page-title">
                <i className="material-icons left">inventory_2</i>
                {esEdicion ? 'Editar Producto' : 'Nuevo Producto'}
            </h4>

            <div className="card">
                <div className="card-content">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {/* Nombre */}
                            <div className="input-field col s12 m6">
                                <input
                                    id="nombre"
                                    name="nombre"
                                    type="text"
                                    value={producto.nombre}
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="nombre">Nombre del Producto *</label>
                            </div>

                            {/* Código de barras */}
                            <div className="input-field col s12 m6">
                                <input
                                    id="codigo_barras"
                                    name="codigo_barras"
                                    type="text"
                                    value={producto.codigo_barras}
                                    onChange={handleChange}
                                />
                                <label htmlFor="codigo_barras">Código de Barras</label>
                            </div>
                        </div>

                        <div className="row">
                            {/* Categoría */}
                            <div className="input-field col s12 m6">
                                <input
                                    id="categoria"
                                    name="categoria"
                                    type="text"
                                    value={producto.categoria}
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="categoria">Categoría *</label>
                            </div>

                            {/* Laboratorio */}
                            <div className="input-field col s12 m6">
                                <input
                                    id="laboratorio"
                                    name="laboratorio"
                                    type="text"
                                    value={producto.laboratorio}
                                    onChange={handleChange}
                                />
                                <label htmlFor="laboratorio">Laboratorio</label>
                            </div>
                        </div>

                        <div className="row">
                            {/* Precio Compra */}
                            <div className="input-field col s12 m4">
                                <input
                                    id="precio_compra"
                                    name="precio_compra"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={producto.precio_compra}
                                    onChange={handleChange}
                                />
                                <label htmlFor="precio_compra">Precio de Compra</label>
                            </div>

                            {/* Precio Venta */}
                            <div className="input-field col s12 m4">
                                <input
                                    id="precio_venta"
                                    name="precio_venta"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={producto.precio_venta}
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="precio_venta">Precio de Venta *</label>
                            </div>

                            {/* Fecha vencimiento */}
                            <div className="input-field col s12 m4">
                                <input
                                    id="fecha_vencimiento"
                                    name="fecha_vencimiento"
                                    type="date"
                                    value={producto.fecha_vencimiento}
                                    onChange={handleChange}
                                />
                                <label htmlFor="fecha_vencimiento">Fecha de Vencimiento</label>
                            </div>
                        </div>

                        <div className="row">
                            {/* Stock Actual */}
                            <div className="input-field col s12 m6">
                                <input
                                    id="stock_actual"
                                    name="stock_actual"
                                    type="number"
                                    min="0"
                                    value={producto.stock_actual}
                                    onChange={handleChange}
                                />
                                <label htmlFor="stock_actual">Stock Actual</label>
                            </div>

                            {/* Stock Mínimo */}
                            <div className="input-field col s12 m6">
                                <input
                                    id="stock_minimo"
                                    name="stock_minimo"
                                    type="number"
                                    min="0"
                                    value={producto.stock_minimo}
                                    onChange={handleChange}
                                />
                                <label htmlFor="stock_minimo">Stock Mínimo</label>
                            </div>
                        </div>

                        <div className="row">
                            {/* Descripción */}
                            <div className="input-field col s12">
                                <textarea
                                    id="descripcion"
                                    name="descripcion"
                                    className="materialize-textarea"
                                    value={producto.descripcion}
                                    onChange={handleChange}
                                ></textarea>
                                <label htmlFor="descripcion">Descripción</label>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col s12">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="activo"
                                        checked={producto.activo}
                                        onChange={handleChange}
                                    />
                                    <span>Producto Activo</span>
                                </label>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="row">
                            <div className="col s12">
                                <button
                                    type="submit"
                                    className="btn waves-effect waves-light teal"
                                    disabled={guardando}
                                >
                                    {guardando ? 'Guardando...' : (esEdicion ? 'Actualizar' : 'Guardar')}
                                    <i className="material-icons right">save</i>
                                </button>
                                <button
                                    type="button"
                                    className="btn waves-effect waves-light grey"
                                    onClick={() => navigate('/productos')}
                                    disabled={guardando}
                                    style={{ marginLeft: '10px' }}
                                >
                                    Cancelar
                                    <i className="material-icons right">cancel</i>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormProducto;
