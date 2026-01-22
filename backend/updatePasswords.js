const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

const updatePasswords = async () => {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'nova_salud_db'
    });

    const password = 'Admin123!';
    const hash = await bcrypt.hash(password, 10);

    console.log('Actualizando contraseñas...');
    console.log('Password:', password);
    console.log('Hash:', hash);

    await connection.execute(
        'UPDATE usuarios SET password = ? WHERE id_usuario IN (1, 2, 3)',
        [hash]
    );

    console.log('✅ Contraseñas actualizadas correctamente');

    // Verificar
    const [rows] = await connection.execute(
        'SELECT id_usuario, nombre, email FROM usuarios WHERE id_usuario IN (1, 2, 3)'
    );

    console.log('\nUsuarios actualizados:');
    rows.forEach(row => {
        console.log(`- ${row.nombre} (${row.email})`);
    });

    await connection.end();
};

updatePasswords().catch(console.error);
