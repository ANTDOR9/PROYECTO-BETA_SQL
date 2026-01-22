import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import Loading from './components/common/Loading';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ListaProductos from './pages/Productos/ListaProductos';
import FormProducto from './pages/Productos/FormProducto';
import NuevaVenta from './pages/Ventas/NuevaVenta';
import Clientes from './pages/Clientes';
import Alertas from './pages/Alertas';
import Reportes from './pages/Reportes';
import Perfil from './pages/Perfil';
import Usuarios from './pages/Usuarios';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, cargando } = useAuth();

    if (cargando) {
        return <Loading />;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

// Main App Layout
const AppLayout = ({ children }) => {
    return (
        <>
            <Navbar />
            <Sidebar />
            <main className="main-content">
                {children}
            </main>
        </>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Login Route */}
                    <Route path="/login" element={<Login />} />

                    {/* Protected Routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <AppLayout>
                                    <Dashboard />
                                </AppLayout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/productos"
                        element={
                            <ProtectedRoute>
                                <AppLayout>
                                    <ListaProductos />
                                </AppLayout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/productos/nuevo"
                        element={
                            <ProtectedRoute>
                                <AppLayout>
                                    <FormProducto />
                                </AppLayout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/productos/editar/:id"
                        element={
                            <ProtectedRoute>
                                <AppLayout>
                                    <FormProducto />
                                </AppLayout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/ventas"
                        element={
                            <ProtectedRoute>
                                <AppLayout>
                                    <NuevaVenta />
                                </AppLayout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/clientes"
                        element={
                            <ProtectedRoute>
                                <AppLayout>
                                    <Clientes />
                                </AppLayout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/alertas"
                        element={
                            <ProtectedRoute>
                                <AppLayout>
                                    <Alertas />
                                </AppLayout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/reportes"
                        element={
                            <ProtectedRoute>
                                <AppLayout>
                                    <Reportes />
                                </AppLayout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/perfil"
                        element={
                            <ProtectedRoute>
                                <AppLayout>
                                    <Perfil />
                                </AppLayout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/usuarios"
                        element={
                            <ProtectedRoute>
                                <AppLayout>
                                    <Usuarios />
                                </AppLayout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Default Route */}
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
