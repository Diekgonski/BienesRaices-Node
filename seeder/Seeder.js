import categorias from "./CategoriaSeeder.js";
import precios from "./PrecioSeeder.js";
import usuarios from "./UsuarioSeeder.js";
import { Categoria, Precio, Usuario } from "../models/index.js";
import database from "../config/Database.js";


const importarDatos = async () => {
    try{
        //Autenticar en la base de datos
        await database.authenticate()

        //Generar las columnas
        await database.sync()

        /*Insertar los datos (Esto esta bien, sin embargo, cuando los querys no dependen el uno de otro (llaves foraneas) se puede ejecutar ambos en paralelo)
        await categoria.bulkCreate(categorias);
        await precio.bulkCreate(precios);
        */

        //Insertar los datos
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios),
            Usuario.bulkCreate(usuarios)
        ]);

        console.log('Datos importandos Correctamente');
        process.exit();

    }catch(error){
        console.log(error);
        process.exit(1);
    }
}

const eliminarDatos = async () => {
    try {
        /* Forma larga de limpiar la db
        await Promise.all([
            categoria.destroy({
                where: {},
                truncate: true
            }),
            precio.destroy({
                where: {},
                truncate: true
            })
        ])*/

        //Forma corta de limpiar la db
        await database.sync({force: true});

        console.log('Datos Eliminados Correctamente');
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

//Llamar la función de acuerdo a el script de packeage.json
if(process.argv[2] === '-i'){
    importarDatos();
}

//Llamar la función de acuerdo a el script de packeage.json
if(process.argv[2] === '-e'){
    eliminarDatos();
}