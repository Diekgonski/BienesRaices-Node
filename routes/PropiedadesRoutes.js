import express from 'express';
import { body } from 'express-validator'
import { admin, crearPropiedad, guardarPropiedad, agregarImagen, subirImagen, editarPropiedad, actualizarPropiedad, eliminarPropiedad, cambiarEstado,mostrarPropiedad, enviarMensaje, verMensajes } from '../controllers/PropiedadController.js';
import  protegerRuta  from '../middleware/ProtegerRuta.js'
import upload from '../middleware/subirImagen.js'
import identificarUsuario from '../middleware/IdentificarUsuario.js'


const router = express.Router();

router.get('/misPropiedades', protegerRuta, admin)
router.get('/propiedades/crear', protegerRuta, crearPropiedad)
router.post('/propiedades/crear', protegerRuta, 
    //Validación en la ruta
    body('titulo').notEmpty().withMessage('El titulo del Anuncio es obligatorio'),

    body('descripcion')
    .notEmpty().withMessage('La descripción no puede ir vacía')
    .isLength({max: 200}).withMessage('La descripción es muy larga'),

    body('categoria').isNumeric().withMessage('Selecciona una categoría'),

    body('precio').isNumeric().withMessage('Selecciona un rango de precio'),

    body('habitaciones').isNumeric().withMessage('Selecciona la cantidad de habitaciones'),

    body('estacionamiento').isNumeric().withMessage('Selecciona la cantidad de estacionamientos'),

    body('wc').isNumeric().withMessage('Selecciona la cantidad de baños'),

    body('latitud').notEmpty().withMessage('Ubica la propiedad en el mapa'),
    guardarPropiedad
)

router.get('/propiedades/agregarImagen/:id', protegerRuta, agregarImagen);
router.post('/propiedades/agregarImagen/:id', protegerRuta, upload.single('imagen'), subirImagen);

router.get('/propiedades/editar/:id', protegerRuta, editarPropiedad);

//PUT
router.post('/propiedades/editar/:id', protegerRuta, 
    //Validación en la ruta
    body('titulo').notEmpty().withMessage('El titulo del Anuncio es obligatorio'),

    body('descripcion')
    .notEmpty().withMessage('La descripción no puede ir vacía')
    .isLength({max: 200}).withMessage('La descripción es muy larga'),

    body('categoria').isNumeric().withMessage('Selecciona una categoría'),

    body('precio').isNumeric().withMessage('Selecciona un rango de precio'),

    body('habitaciones').isNumeric().withMessage('Selecciona la cantidad de habitaciones'),

    body('estacionamiento').isNumeric().withMessage('Selecciona la cantidad de estacionamientos'),

    body('wc').isNumeric().withMessage('Selecciona la cantidad de baños'),

    body('latitud').notEmpty().withMessage('Ubica la propiedad en el mapa'),
    actualizarPropiedad
)

//DELETE
router.post('/propiedades/eliminar/:id', protegerRuta, eliminarPropiedad);

router.put('/propiedades/:id', protegerRuta, cambiarEstado)

//Ver Mensajes
router.get('/mensajes/:id', protegerRuta, verMensajes);

//Area publica
router.get('/propiedad/:id', identificarUsuario, mostrarPropiedad);

//Area publica
router.post('/propiedad/:id', identificarUsuario,
body('mensaje').isLength({min: 10}).withMessage('El mensaje no puede ir vacío o es muy corto'),
enviarMensaje);

export default router;