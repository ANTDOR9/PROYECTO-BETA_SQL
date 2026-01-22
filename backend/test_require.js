
try { require('express'); console.log('express ok'); } catch (e) { console.error('express missing'); }
try { require('cors'); console.log('cors ok'); } catch (e) { console.error('cors missing'); }
try { require('morgan'); console.log('morgan ok'); } catch (e) { console.error('morgan missing'); }
try { require('dotenv'); console.log('dotenv ok'); } catch (e) { console.error('dotenv missing'); }
try { require('./models'); console.log('models ok'); } catch (e) { console.error('models missing', e); }
try { require('./routes/auth.routes'); console.log('auth routes ok'); } catch (e) { console.error('auth routes missing', e); }
try { require('./routes/productos.routes'); console.log('productos routes ok'); } catch (e) { console.error('productos routes missing', e); }
try { require('./routes/clientes.routes'); console.log('clientes routes ok'); } catch (e) { console.error('clientes routes missing', e); }
try { require('./routes/ventas.routes'); console.log('ventas routes ok'); } catch (e) { console.error('ventas routes missing', e); }
try { require('./routes/alertas.routes'); console.log('alertas routes ok'); } catch (e) { console.error('alertas routes missing', e); }
try { require('./routes/usuarios.routes'); console.log('usuarios routes ok'); } catch (e) { console.error('usuarios routes missing', e); }
