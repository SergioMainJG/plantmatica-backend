require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

// Añade esto al inicio de tu index.js o server.js
const { monitorEventLoopDelay } = require('perf_hooks');

const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();

// Imprime el retraso del Event Loop cada 5 segundos
setInterval(() => {
  console.log(`[Bloqueo Event Loop] Max: ${h.max / 1e6}ms | Promedio: ${h.mean / 1e6}ms`);
  h.reset(); // Resetea las estadísticas para la siguiente ventana
}, 5000).unref();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

try {

    mongoose.connect(process.env.MONGO, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ssl: false
    });
    console.log('Base de datos online');

} catch (error) {
    console.log(error);
    throw new Error('Error a la hora de conectar a la BD');
}

app.use('/user', require('./routes/user'));
app.use('/login', require('./routes/login'));
app.use('/admin', require('./routes/admin'));
app.use('/ficha', require('./routes/ficha'));
app.use('/solicitud', require('./routes/solicitudes'));
app.use('/comment', require('./routes/comentarios'));

app.listen(process.env.PORT || 8080, () => {
    console.log(`Server in port: ${process.env.PORT}`);
});






