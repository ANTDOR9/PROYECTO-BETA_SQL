import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios.config';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        verificarAuth();
    }, []);

    const verificarAuth = () => {
        const token = localStorage.getItem('token');
        const usuarioGuardado = localStorage.getItem('usuario');

        if (token && usuarioGuardado) {
            try {
                setUsuario(JSON.parse(usuarioGuardado));
            } catch (error) {
                console.error('Error al parsear usuario:', error);
                logout();
            }
        }
        setCargando(false);
    };

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });

            if (response.data.success) {
                const { token, usuario } = response.data.data;
                localStorage.setItem('token', token);
                localStorage.setItem('usuario', JSON.stringify(usuario));
                setUsuario(usuario);
                return { success: true };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Error al iniciar sesión'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setUsuario(null);
    };

    const value = {
        usuario,
        login,
        logout,
        cargando,
        isAuthenticated: !!usuario,
        isAdmin: usuario?.rol === 'admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
