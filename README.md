# PROYECTO-BETA_SQL

```
├── backend/                      # Servidor Node.js + Express
│   ├── config/                   # Configuraciones
│   │   ├── database.js          # Configuración de Sequelize
│   │   └── jwt.config.js        # Configuración de JWT
│   │
│   ├── controllers/              # Controladores (lógica de negocio)
│   │   ├── auth.controller.js   # Autenticación
│   │   ├── productos.controller.js
│   │   ├── clientes.controller.js
│   │   ├── ventas.controller.js
│   │   ├── alertas.controller.js
│   │   └── usuarios.controller.js
│   │
│   ├── middlewares/              # Middlewares personalizados
│   │   ├── auth.middleware.js   # Verificación de JWT
│   │   └── validators.js        # Validaciones de datos
│   │
│   ├── models/                   # Modelos de Sequelize
│   │   ├── index.js             # Configuración y relaciones
│   │   ├── Usuario.js
│   │   ├── Producto.js
│   │   ├── Cliente.js
│   │   ├── Venta.js
│   │   ├── DetalleVenta.js
│   │   └── AlertaStock.js
│   │
│   ├── routes/                   # Definición de rutas
│   │   ├── auth.routes.js
│   │   ├── productos.routes.js
│   │   ├── clientes.routes.js
│   │   ├── ventas.routes.js
│   │   ├── alertas.routes.js
│   │   └── usuarios.routes.js
│   │
│   ├── .env                      # Variables de entorno (no versionado)
│   ├── .env.example             # Ejemplo de variables de entorno
│   ├── package.json             # Dependencias del backend
│   └── server.js                # Punto de entrada del servidor
│
├── frontend/                     # Aplicación React
│   ├── src/
│   │   ├── api/                 # Cliente API
│   │   │   └── axios.js         # Configuración de Axios
│   │   │
│   │   ├── components/          # Componentes reutilizables
│   │   │   ├── Layout.jsx       # Layout principal
│   │   │   ├── Navbar.jsx       # Barra de navegación
│   │   │   └── PrivateRoute.jsx # Protección de rutas
│   │   │
│   │   ├── context/             # Context API
│   │   │   └── AuthContext.jsx  # Contexto de autenticación
│   │   │
│   │   ├── pages/               # Páginas de la aplicación
│   │   │   ├── Login.jsx        # Página de inicio de sesión
│   │   │   ├── Dashboard.jsx    # Panel principal
│   │   │   ├── Productos/       # Gestión de productos
│   │   │   │   ├── Productos.jsx
│   │   │   │   └── ProductoForm.jsx
│   │   │   ├── Ventas/          # Sistema de ventas
│   │   │   │   └── Ventas.jsx
│   │   │   ├── Clientes.jsx     # Gestión de clientes
│   │   │   ├── Usuarios.jsx     # Gestión de usuarios
│   │   │   ├── Alertas.jsx      # Sistema de alertas
│   │   │   ├── Reportes.jsx     # Reportes y estadísticas
│   │   │   └── Perfil.jsx       # Perfil de usuario
│   │   │
│   │   ├── App.jsx              # Componente principal
│   │   ├── main.jsx             # Punto de entrada
│   │   └── index.css            # Estilos globales
│   │
│   ├── .env                      # Variables de entorno (no versionado)
│   ├── .env.example             # Ejemplo de variables de entorno
│   ├── index.html               # HTML principal
│   ├── package.json             # Dependencias del frontend
│   └── vite.config.js           # Configuración de Vite
│
├── database/                     # Scripts de base de datos
│   └── nova_salud.sql           # Script de creación e inserción
│
├── .gitignore                    # Archivos ignorados por Git
└── README.md                     # Este archivo
```
