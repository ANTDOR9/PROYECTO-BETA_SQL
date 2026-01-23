import React, { useState, useEffect } from 'react';
import api from '../../api/axios.config';
import { useAuth } from '../../context/AuthContext';
import M from 'materialize-css';

const NuevaVenta = () => {
    const { usuario } = useAuth();
    const [productos, setProductos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [busquedaProducto, setBusquedaProducto] = useState('');
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState('');
    const [tipoPago, setTipoPago] = useState('efectivo');
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        cargarDatos();
    }, []);

    useEffect(() => {
        const selects = document.querySelectorAll('select');
        M.FormSelect.init(selects);
    }, [clientes]);

    useEffect(() => {
        if (busquedaProducto) {
            const filtrados = productos.filter(p =>
                p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
                p.codigo_barras?.toLowerCase().includes(busquedaProducto.toLowerCase())
            ).slice(0, 5);
            setProductosFiltrados(filtrados);
        } else {
            setProductosFiltrados([]);
        }
    }, [busquedaProducto, productos]);

    const cargarDatos = async () => {
        try {
            const [productosRes, clientesRes] = await Promise.all([
                api.get('/productos?activo=true'),
                api.get('/clientes')
            ]);

            if (productosRes.data.success) {
                setProductos(productosRes.data.data.filter(p => p.stock_actual > 0));
            }
            if (clientesRes.data.success) {
                setClientes(clientesRes.data.data);
            }
        } catch (error) {
            M.toast({ html: 'Error al cargar datos', classes: 'red' });
        }
    };

    const agregarAlCarrito = (producto) => {
        const itemExistente = carrito.find(item => item.id_producto === producto.id_producto);

        if (itemExistente) {
            if (itemExistente.cantidad < producto.stock_actual) {
                setCarrito(carrito.map(item =>
                    item.id_producto === producto.id_producto
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                ));
            } else {
                M.toast({ html: 'Stock insuficiente', classes: 'orange' });
            }
        } else {
            setCarrito([...carrito, { ...producto, cantidad: 1 }]);
        }
        setBusquedaProducto('');
        setProductosFiltrados([]);
    };

    const actualizarCantidad = (id, cantidad) => {
        const producto = productos.find(p => p.id_producto === id);
        if (cantidad <= producto.stock_actual && cantidad > 0) {
            setCarrito(carrito.map(item =>
                item.id_producto === id ? { ...item, cantidad: parseInt(cantidad) } : item
            ));
        }
    };

    const eliminarDelCarrito = (id) => {
        setCarrito(carrito.filter(item => item.id_producto !== id));
    };

    const calcularSubtotal = () => {
        return carrito.reduce((sum, item) => sum + (parseFloat(item.precio_venta) * item.cantidad), 0);
    };

    const calcularIGV = () => {
        return calcularSubtotal() * 0.18;
    };

    const calcularTotal = () => {
        return calcularSubtotal() + calcularIGV();
    };

    const procesarVenta = async () => {
        if (carrito.length === 0) {
            M.toast({ html: 'Agregue productos al carrito', classes: 'orange' });
            return;
        }

        setGuardando(true);
        try {
            const ventaData = {
                id_cliente: clienteSeleccionado || null,
                productos: carrito.map(item => ({
                    id_producto: item.id_producto,
                    cantidad: item.cantidad
                })),
                tipo_pago: tipoPago
            };

            const response = await api.post('/ventas', ventaData);

            if (response.data.success) {
                M.toast({ html: 'Venta registrada exitosamente', classes: 'green' });
                // Resetear formulario
                setCarrito([]);
                setClienteSeleccionado('');
                setTipoPago('efectivo');
                setBusquedaProducto('');
                cargarDatos(); // Recargar productos para actualizar stock
            }
        } catch (error) {
            M.toast({
                html: error.response?.data?.message || 'Error al procesar venta',
                classes: 'red'
            });
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className="container" style={{ marginTop: '20px' }}>
            <h4 className="page-title">
                <i className="material-icons left">point_of_sale</i>
                Nueva Venta
            </h4>

            <div className="row">
                {/* Panel izquierdo - Búsqueda y productos */}
                <div className="col s12 l8">
                    <div className="card">
                        <div className="card-content">
                            <span className="card-title">Agregar Productos</span>

                            {/* Búsqueda de productos */}
                            <div className="input-field" style={{ position: 'relative' }}>
                                <i className="material-icons prefix">search</i>
                                <input
                                    id="busqueda"
                                    type="text"
                                    value={busquedaProducto}
                                    onChange={(e) => setBusquedaProducto(e.target.value)}
                                    placeholder="Buscar por nombre o código de barras"
                                />
                                <label htmlFor="busqueda">Buscar Producto</label>

                                {/* Lista de sugerencias */}
                                {productosFiltrados.length > 0 && (
                                    <div className="collection" style={{ position: 'absolute', zIndex: 1000, width: '100%' }}>
                                        {productosFiltrados.map(producto => (
                                            <a
                                                key={producto.id_producto}
                                                href="#!"
                                                className="collection-item"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    agregarAlCarrito(producto);
                                                }}
                                            >
                                                <strong>{producto.nombre}</strong>
                                                <br />
                                                <small>
                                                    Stock: {producto.stock_actual} | Precio: S/ {parseFloat(producto.precio_venta).toFixed(2)}
                                                </small>
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Carrito */}
                            <div className="mt-3">
                                <h6>Carrito de Compras</h6>
                                {carrito.length > 0 ? (
                                    <table className="striped highlight">
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th>Precio</th>
                                                <th>Cantidad</th>
                                                <th>Subtotal</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {carrito.map(item => (
                                                <tr key={item.id_producto}>
                                                    <td>
                                                        <strong>{item.nombre}</strong>
                                                        <br />
                                                        <small className="grey-text">Stock: {item.stock_actual}</small>
                                                    </td>
                                                    <td>S/ {parseFloat(item.precio_venta).toFixed(2)}</td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max={item.stock_actual}
                                                            value={item.cantidad}
                                                            onChange={(e) => actualizarCantidad(item.id_producto, e.target.value)}
                                                            style={{ width: '70px' }}
                                                        />
                                                    </td>
                                                    <td>S/ {(parseFloat(item.precio_venta) * item.cantidad).toFixed(2)}</td>
                                                    <td>
                                                        <button
                                                            className="btn-small waves-effect waves-light red"
                                                            onClick={() => eliminarDelCarrito(item.id_producto)}
                                                        >
                                                            <i className="material-icons">delete</i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="center-align grey-text">El carrito está vacío</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Panel derecho - Resumen de venta */}
                <div className="col s12 l4">
                    <div className="card">
                        <div className="card-content">
                            <span className="card-title">Resumen de Venta</span>

                            {/* Cliente */}
                            <div className="input-field">
                                <select value={clienteSeleccionado} onChange={(e) => setClienteSeleccionado(e.target.value)}>
                                    <option value="">Sin cliente</option>
                                    {clientes.map(cliente => (
                                        <option key={cliente.id_cliente} value={cliente.id_cliente}>
                                            {cliente.nombre} {cliente.apellido} - {cliente.dni}
                                        </option>
                                    ))}
                                </select>
                                <label>Cliente (Opcional)</label>
                            </div>

                            {/* Tipo de pago */}
                            <div className="input-field">
                                <select value={tipoPago} onChange={(e) => setTipoPago(e.target.value)}>
                                    <option value="efectivo">Efectivo</option>
                                    <option value="tarjeta">Tarjeta</option>
                                    <option value="transferencia">Transferencia</option>
                                </select>
                                <label>Tipo de Pago</label>
                            </div>

                            <div className="divider mb-2"></div>

                            {/* Totales */}
                            <div style={{ fontSize: '1.1rem' }}>
                                <div className="flex-between mb-1">
                                    <span>Subtotal:</span>
                                    <span>S/ {calcularSubtotal().toFixed(2)}</span>
                                </div>
                                <div className="flex-between mb-1">
                                    <span>IGV (18%):</span>
                                    <span>S/ {calcularIGV().toFixed(2)}</span>
                                </div>
                                <div className="divider mb-1"></div>
                                <div className="flex-between" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                    <span>Total:</span>
                                    <span className="teal-text">S/ {calcularTotal().toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Botón procesar */}
                            <button
                                className="btn waves-effect waves-light teal full-width mt-3"
                                onClick={procesarVenta}
                                disabled={guardando || carrito.length === 0}
                            >
                                {guardando ? 'Procesando...' : 'Procesar Venta'}
                                <i className="material-icons right">shopping_cart</i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NuevaVenta;
