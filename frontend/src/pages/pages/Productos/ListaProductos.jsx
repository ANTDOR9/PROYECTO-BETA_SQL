import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.config';
import Loading from '../../components/common/Loading';
import M from 'materialize-css';

const ListaProductos = () => {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState('');
    const [categoria, setCategoria] = useState('');
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        cargarProductos();
    }, []);

    useEffect(() => {
        // Inicializar selects
        const selects = document.querySelectorAll('select');
        M.FormSelect.init(selects);

        // Inicializar modals
        const modals = document.querySelectorAll('.modal');
        M.Modal.init(modals);
    }, [productos]);

    const cargarProductos = async () => {
        try {
            const response = await api.get('/productos');
            if (response.data.success) {
                setProductos(response.data.data);

                // Extraer categorías únicas
                const cats = [...new Set(response.data.data.map(p => p.categoria))];
                setCategorias(cats);
            }
        } catch (error) {
            console.error('Error al cargar productos:', error);
            M.toast({ html: 'Error al cargar productos', classes: 'red' });
        } finally {
            setCargando(false);
        }
    };

    const eliminarProducto = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este producto?')) {
            try {
                await api.delete(`/productos/${id}`);
                M.toast({ html: 'Producto eliminado exitosamente', classes: 'green' });
                cargarProductos();
            } catch (error) {
                M.toast({ html: 'Error al eliminar producto', classes: 'red' });
            }
        }
    };

    const productosFiltrados = productos.filter(producto => {
        const matchBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            producto.codigo_barras?.toLowerCase().includes(busqueda.toLowerCase());
        const matchCategoria = !categoria || producto.categoria === categoria;
        return matchBusqueda && matchCategoria;
    });

    if (cargando) {
        return <Loading />;
    }

    return (
        <div className="container" style={{ marginTop: '20px' }}>
            <div className="flex-between mb-3">
                <h4 className="page-title">
                    <i className="material-icons left">inventory_2</i>
                    Productos
                </h4>
                <Link to="/productos/nuevo" className="btn waves-effect waves-light teal">
                    <i className="material-icons left">add</i>
                    Nuevo Producto
                </Link>
            </div>

            {/* Filtros */}
            <div className="card">
                <div className="card-content">
                    <div className="row mb-0">
                        <div className="input-field col s12 m8">
                            <i className="material-icons prefix">search</i>
                            <input
                                id="busqueda"
                                type="text"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                            <label htmlFor="busqueda">Buscar por nombre o código de barras</label>
                        </div>
                        <div className="input-field col s12 m4">
                            <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                                <option value="">Todas las categorías</option>
                                {categorias.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <label>Categoría</label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de productos */}
            <div className="card">
                <div className="card-content">
                    <span className="card-title">
                        Lista de Productos ({productosFiltrados.length})
                    </span>

                    {productosFiltrados.length > 0 ? (
                        <table className="striped highlight responsive-table">
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Nombre</th>
                                    <th>Categoría</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Estado</th>
                                    <th className="center-align">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productosFiltrados.map(producto => (
                                    <tr key={producto.id_producto}>
                                        <td>{producto.codigo_barras || 'N/A'}</td>
                                        <td>
                                            <strong>{producto.nombre}</strong>
                                            <br />
                                            <small className="grey-text">{producto.laboratorio}</small>
                                        </td>
                                        <td>
                                            <span className="chip">
                                                {producto.categoria}
                                            </span>
                                        </td>
                                        <td>S/ {parseFloat(producto.precio_venta).toFixed(2)}</td>
                                        <td>
                                            <span className={`chip ${producto.stock_actual <= producto.stock_minimo ? 'orange white-text' : 'teal white-text'}`}>
                                                {producto.stock_actual} unids.
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`chip ${producto.activo ? 'green white-text' : 'grey white-text'}`}>
                                                {producto.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="center-align">
                                            <Link
                                                to={`/productos/editar/${producto.id_producto}`}
                                                className="btn-small waves-effect waves-light blue"
                                                style={{ marginRight: '5px' }}
                                            >
                                                <i className="material-icons">edit</i>
                                            </Link>
                                            <button
                                                onClick={() => eliminarProducto(producto.id_producto)}
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
                            <i className="material-icons large grey-text">inventory_2</i>
                            <p className="grey-text">No se encontraron productos</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListaProductos;
