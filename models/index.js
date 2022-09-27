import Propiedad from './Propiedad.js'
import Precio from './Precio.js'
import Categoria from './Categoria.js'
import Usuario from './Usuario.js'
import Mensaje from './Mensaje.js';


// Relacion 1:1, una propiedad tiene un precio
Propiedad.belongsTo(Precio, {foreingKey: 'idPrecio', as: 'precio'});
/* Segunda forma de hacerlo
precio.hasOne(propiedad);*/

// Relación 1:1, una propiedad tiene una categoria
Propiedad.belongsTo(Categoria, {foreingKey: 'idCategoria', as: 'categoria'});

// Relacion 1:1, una propiedad tiene un usuario
Propiedad.belongsTo(Usuario, {foreingKey: 'idUsuario', as: 'usuario'});

Mensaje.belongsTo(Propiedad, {foreingKey: 'idPropiedad', as: 'propiedad'});
Mensaje.belongsTo(Usuario, {foreingKey: 'idUsuario', as: 'usuario'});


export {
    Propiedad,
    Precio,
    Categoria,
    Usuario,
    Mensaje
}