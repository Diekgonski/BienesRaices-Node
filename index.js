import express from "express";
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import usuarioRoutes from './routes/UsuarioRoutes.js';
import propiedadesRoutes from './routes/PropiedadesRoutes.js'
import appRoutes from './routes/AppRoutes.js'
import apiRoutes from './routes/ApiRoutes.js'
import database from "./config/Database.js";

//Crear la app
const app = express();

//Habilitar lectura de datos de formularios
app.use(express.urlencoded({extended: true}));

//Habilitar cookie-parser
app.use( cookieParser () )

//Habilitar CSRF
app.use( csrf({cookie: true}) )

//Conexión a la base de datos
try {
    await database.authenticate();
    database.sync();
    console.log('Conexión con la base de datos funcionando correctamente');
} catch (error) {
    console.log(error);
}

// Habilitar Pug
app.set('view engine', 'pug');
app.set('views', './views');

//Carpeta publica con archivos estáticos (CSS, JS, Img, etc.)
app.use(express.static('public'));

//Routing
app.use('/', appRoutes)
app.use('/auth', usuarioRoutes);
app.use('/', propiedadesRoutes);
app.use('/api', apiRoutes);



// Definit un puerto para arrancar el proyecto
const port = process.env.PORT || 3000;

app.listen(port, ()=> {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
});