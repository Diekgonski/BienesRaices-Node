import { unlink } from 'node:fs/promises'
import { validationResult } from "express-validator"
import { Precio, Categoria, Propiedad } from "../models/index.js"
import { esVendedor } from '../helpers/index.js'

const admin = async (req, res) => {

    //Leer QueryString
    const { pagina: paginaActual } = req.query;

    //Expresión regular para validar que siempre debe iniciar y finalizar con digitos el QueryString
    const expresionRegular = /^[1-9]$/;

    if (!expresionRegular.test(paginaActual)) {
        return res.redirect('/misPropiedades?pagina=1')
    }

    try {
        //Traer las propiedades del usuario que se encuentra logeado
        const { id } = req.usuario;

        //Limites y Offset para el paginador
        const limit = 10;
        const offset = ((paginaActual * limit) - limit);

        const [propiedades, total] = await Promise.all([
            Propiedad.findAll({
                limit: limit,
                offset: offset,
                where: {
                    UsuarioId: id
                },
                include: [
                    {
                        model: Categoria,
                        as: 'categoria'
                    },
                    {
                        model: Precio,
                        as: 'precio'
                    }
                ]
            }),
            Propiedad.count({
                where: {
                    UsuarioId: id
                }
            })
        ]);

        

        res.render('propiedades/admin', {
            pagina: 'Mis Propiedades',
            propiedades: propiedades,
            csrfToken: req.csrfToken(),
            paginas: Math.ceil(total / limit),
            paginaActual: Number(paginaActual),
            total: total,
            offset: offset,
            limit: limit
        });

    } catch (error) {
        console.log(error);
    }

}

const crearPropiedad = async (req, res) => {
    //Consultar modelo de precio y categoria
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

    res.render('propiedades/crear', {
        pagina: 'Crear Propiedad',
        csrfToken: req.csrfToken(),
        categorias: categorias,
        precios: precios,
        datos: {}
    })
}

const guardarPropiedad = async (req, res) => {
    //Resultado de la validación
    let resultado = validationResult(req);
    if (!resultado.isEmpty()) {

        //Consultar modelo de precio y categoria
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ]);

        return res.render('propiedades/crear', {
            pagina: 'Crear Propiedad',
            csrfToken: req.csrfToken(),
            categorias: categorias,
            precios: precios,
            errores: resultado.array(),
            datos: req.body
        })
    }

    // Crear un registro
    const { titulo, descripcion, categoria, precio, habitaciones, estacionamiento, wc, calle, latitud, longitud } = req.body;



    const { id: usuarioId } = req.usuario;

    console.log(usuarioId);

    try {
        const propiedadGuardada = await Propiedad.create({
            titulo: titulo,
            descripcion: descripcion,
            habitaciones: habitaciones,
            estacionamiento: estacionamiento,
            wc: wc,
            calle: calle,
            latitud: latitud,
            longitud: longitud,
            precioId: precio,
            categoriaId: categoria,
            usuarioId: usuarioId,
            imagen: ''
        })

        const { id } = propiedadGuardada;

        res.redirect(`/propiedades/agregarImagen/${id}`);

    } catch (error) {
        console.log(error);
    }

}

const agregarImagen = async (req, res) => {

    const { id } = req.params;

    //Validad que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);

    if (!propiedad) {
        return res.redirect('/misPropiedades');
    }

    // Validar que la propiedad no este publicada
    if (propiedad.publicado) {
        return res.redirect('/misPropiedades');
    }

    console.log(propiedad.usuarioId);
    // Validar que la propiedad pertenece a quien visite la pagina
    if (req.usuario.id !== propiedad.usuarioId) {
        return res.redirect('/misPropiedades');
    }


    res.render('propiedades/agregarImagen', {
        pagina: `Agregar Imagen: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        propiedad: propiedad,
    })
}

const subirImagen = async (req, res, next) => {

    const { id } = req.params;

    //Validad que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);

    if (!propiedad) {
        return res.redirect('/misPropiedades');
    }

    // Validar que la propiedad no este publicada
    if (propiedad.publicado) {
        return res.redirect('/misPropiedades');
    }

    // Validar que la propiedad pertenece a quien visite la pagina
    if (req.usuario.id !== propiedad.usuarioId) {
        return res.redirect('/misPropiedades');
    }


    try {

        const { filename } = req.file;
        //Almacenar la imagen y publicar la propiedad
        propiedad.imagen = filename;
        propiedad.publicado = 1;

        await propiedad.save();

        next();

    } catch (error) {
        console.log(error);
    }
}

const editarPropiedad = async (req, res) => {

    const { id } = req.params;

    //Validar que ka propiedad exista
    const propiedad = await Propiedad.findByPk(id);

    if (!propiedad) {
        return res.redirect('/misPropiedades');
    }

    //Revisar que el que visita la Url es el dueño de la propiedad
    const { id: idUsuario } = req.usuario;

    if (propiedad.usuarioId.toString() !== idUsuario.toString()) {
        return res.redirect('/misPropiedades');
    }

    //Consultar modelo de precio y categoria
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

    res.render('propiedades/editar', {
        pagina: `Editar Propiedad ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        categorias: categorias,
        precios: precios,
        datos: propiedad
    })
}

const actualizarPropiedad = async (req, res) => {

    //Resultado de la validación
    let resultado = validationResult(req);
    if (!resultado.isEmpty()) {

        //Consultar modelo de precio y categoria
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ]);

        return res.render('propiedades/editar', {
            pagina: 'Editar Propiedad',
            csrfToken: req.csrfToken(),
            categorias: categorias,
            precios: precios,
            errores: resultado.array(),
            datos: req.body
        });
    }

    const { id } = req.params;

    //Validar que ka propiedad exista
    const propiedad = await Propiedad.findByPk(id);

    if (!propiedad) {
        return res.redirect('/misPropiedades');
    }

    //Revisar que el que visita la Url es el dueño de la propiedad
    const { id: idUsuario } = req.usuario;

    if (propiedad.usuarioId.toString() !== idUsuario.toString()) {
        return res.redirect('/misPropiedades');
    }

    //Reescribir el objeto y asignar los nuevos valores
    try {
        // Crear un registro
        const { titulo, descripcion, categoria, precio, habitaciones, estacionamiento, wc, calle, latitud, longitud } = req.body;

        propiedad.set({
            titulo: titulo,
            descripcion: descripcion,
            habitaciones: habitaciones,
            estacionamiento: estacionamiento,
            wc: wc,
            calle: calle,
            latitud: latitud,
            longitud: longitud,
            precioId: precio,
            categoriaId: categoria,
        });

        await propiedad.save();

        res.redirect('/misPropiedades');

    } catch (error) {
        console.log(error);
    }
}

const eliminarPropiedad = async (req, res) => {

    const { id } = req.params;

    //Validar que ka propiedad exista
    const propiedad = await Propiedad.findByPk(id);

    if (!propiedad) {
        return res.redirect('/misPropiedades');
    }

    //Revisar que el que visita la Url es el dueño de la propiedad
    const { id: idUsuario } = req.usuario;

    if (propiedad.usuarioId.toString() !== idUsuario.toString()) {
        return res.redirect('/misPropiedades');
    }

    //Eliminar la imagen del servidor
    await unlink(`public/uploads/${propiedad.imagen}`);
    console.log(`Se eliminó la imagen ${propiedad.imagen}`);

    //Eliminar la propiedad
    await propiedad.destroy();
    res.redirect('/misPropiedades');

}

//Muestra una propiedad
const monstrarPropiedad = async (req, res) => {

    const { id } = req.params;

    //Comprobar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            {
                model: Categoria,
                as: 'categoria'
            },
            {
                model: Precio,
                as: 'precio'
            }
        ]
    });

    if (!propiedad) {
        return res.redirect('/404');
    }

    res.render('propiedades/mostrar', {
        propiedad,
        pagina: propiedad.titulo,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId)
    })
}

export {
    admin,
    crearPropiedad,
    guardarPropiedad,
    agregarImagen,
    subirImagen,
    editarPropiedad,
    actualizarPropiedad,
    eliminarPropiedad,
    monstrarPropiedad
}