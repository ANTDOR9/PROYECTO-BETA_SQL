const bcrypt = require('bcryptjs');

const password = 'Admin123!';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log('Password:', password);
        console.log('Hash:', hash);
        console.log('\nSQL para actualizar usuarios:');
        console.log(`UPDATE usuarios SET password = '${hash}' WHERE id_usuario IN (1, 2, 3);`);
    }
});
