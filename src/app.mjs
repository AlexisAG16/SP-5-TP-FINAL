import express from 'express';
import path from 'path';
import expressLayouts from 'express-ejs-layouts';
import { connectDB } from './config/dbconfig.mjs';
import paisesRoutes from './routes/paisesRoutes.mjs';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import { fileURLToPath } from 'url';
import { cargarPaises } from './utilities/cargarPaises.mjs';

// Manejo de promesas no capturadas (Unhandled Promise Rejection)
process.on('unhandledRejection', (reason, promise) => {
    console.error('Promesa no capturada:', reason.message || reason);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const loggerMiddleware = (req, res, next) => {
    console.log(`Peticion Recibida: ${req.method} ${req.url}`);
    next();
};

// Esta es la nueva función asíncrona que controlará el arranque del servidor
const startServer = async () => {
    try {
        console.log('Intentando conectar a la base de datos...');
        await connectDB();
        console.log('¡Conexión a la base de datos exitosa!');

        await cargarPaises();

        // El servidor solo se iniciará si la conexión y la carga de datos son exitosas
        app.listen(PORT, () => {
            console.log(`Servidor en línea en el puerto ${PORT}`);
            console.log(`URL de la API: http://localhost:${PORT}/api/`);
        });

    } catch (error) {
        console.error('Error FATAL al iniciar la aplicación:', error);
        // Sal del proceso si falla la conexión a la base de datos
        process.exit(1);
    }
};

// Middlewares y configuración de la aplicación
app.use(loggerMiddleware);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', paisesRoutes);

// Manejador de errores global
app.use((err, req, res, next) => {
    console.error('Error no controlado:', err.stack);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Error interno del servidor.';
    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

app.use((req, res) => {
    res.status(404).send({ mensaje: "Ruta no encontrada" });
});

// Llama a la función que inicia el servidor
startServer();


/*
import express from 'express';
import path from 'path';
import expressLayouts from 'express-ejs-layouts';
import {connectDB} from './config/dbconfig.mjs';
//import paisesRoutes from './routes/paisesRoutes.mjs';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import { fileURLToPath } from 'url';
import { cargarPaises } from './cargarPaises.mjs';

// Manejo de promesas no capturadas (Unhandled Promise Rejection)

process.on('unhandledRejection', (reason, promise) => {
    console.error('Promesa no capturada:', reason.message || reason);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const loggerMiddleware = (req,res,next) =>
{
    console.log(`Peticion Recibida: ${req.body} ${req.url}`);
    next();
};


try {
    connectDB();
    console.log('Intentando conectar a la base de datos...');

    // Llama a la función para cargar los países
    await cargarPaises();

} catch (error) {
    console.error('Error FATAL al conectar a la base de datos:', error);
}
//connectDB();

app.use(loggerMiddleware);

// para peticiones post en formularios
app.use(bodyParser.urlencoded({ extended: true }));

// convertir metodos de formularios a put o delete
app.use(methodOverride('_method'));

// parsea los datos JSON que se envian en http
app.use(express.json());

// vistas ejs
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));


// express ejs layouts
app.set('layout','layout');
app.use(expressLayouts);

// para traer estilos al server
app.use(express.static(path.join(__dirname, 'public')));


//app.use('/api',paisesRoutes);

// Manejador de errores global
app.use((err, req, res, next) => {
    console.error('Error no controlado:', err.stack);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Error interno del servidor.';

    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

app.use((req,res) => {
    res.status(404).send({mensaje:"Ruta no encontrada"});
});

app.listen(PORT,async()=>
{
    console.log(`Servidor escuchando en el puerto ${PORT} , en http://localhost:${PORT}/api/`);
    //console.log(`Servidor escuchando en el puerto ${PORT} , en http://localhost:${PORT}/api/paises`);
}); */