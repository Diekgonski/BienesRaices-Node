import {check, validationResult} from 'express-validator';
import bcrypt from 'bcrypt';
import Usuario from "../models/Usuario.js"
import { generarId, generarJWT } from '../helpers/Tokens.js';
import { emailOlvideMiPassword, emailRegistro } from '../helpers/Emails.js';


const formularioLogin = (req, res) => {
    
    res.render('auth/login', {
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken()
    })
}

const autenticarUsuario = async (req, res) => {
    // Validación
    await check('email').isEmail().withMessage('El Email es obligatorio').run(req);

    await check('password').notEmpty().withMessage('El password es obligatorio').run(req);

    let resultado = validationResult(req);

    //Verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        //Hay errores
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        })
    }

    //Comprobar si el usuario existe
    const {email, password} = req.body;

    const usuario = await Usuario.findOne({
        where: {email}
    })

    if(!usuario){
        //Hay errores
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario no existe'}],
        })
    }

    //Comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        //Hay errores
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'Tu cuenta no ha sido confirmada'}],
        })
    }

    //Revisar el password
    if(!usuario.verificarPassword(password)){
        //Hay errores
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El password es incorrecto'}],
        })
    }

    // Autenticar al usuario
    const token = generarJWT({
        id: usuario.id,
        nombre: usuario.nombre
    });

    // Almacenar token en un cookie
    return res.cookie('_token', token, {
        httpOnly: true,
        //Opciones solo si se tiene un certificado SSL
        //secure: true,
        //sameSite: true
    }).redirect('/misPropiedades');
}

const cerrarSesion = (req, res) => {
    return res.clearCookie('_token').status(200).redirect('/auth/login');
}

const formularioRegistro = (req, res) => {

    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()
    })
}

const registrarUsuario = async (req, res) => {
    //Validación
    await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req);

    await check('email').isEmail().withMessage('Ingrese un email válido').run(req);

    await check('password').isLength({min: 8}).withMessage('El Password debe ser de al menos 8 caracteres').run(req);
    
    await check('repetirPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Los Passwords no son iguales');
        }
    
        // Indicates the success of this synchronous custom validator
        return true;
      }).withMessage('Los Passwords no son iguales').run(req);

    let resultado = validationResult(req);

    //Verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        //Hay errores
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre:req.body.nombre,
                email:req.body.email,
            }
        })
    }

    //Extraer Datos
    const { nombre, email, password } = req.body;

    //Verificar que el usuario no este duplicado
    const existeUsuario = await Usuario.findOne({ where: { email}});

    if(existeUsuario){
        //El usuario ya existe
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario ya esta registrado con ese email'}],
            usuario: {
                nombre:req.body.nombre,
                email:req.body.email,
            }
        })
    }

    //Guardar Usuario
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    })

    //Envia email de confirmación
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    //Mostrar mensaje de confirmación
    res.render('templates/mensaje', {
        pagina: 'Cuenta Creada Correctamente',
        mensaje: 'Hemos Enviado un Email de Confirmación, presiona en el enlace'
    })
    
}

//Comprobar una cuenta por medio del token
const confirmarToken = async (req, res) => {

    const { token } = req.params;

    // Verificar si el token es válido
    const usuario = await Usuario.findOne({
        where: {token}
    });

    if(!usuario){
        return res.render('auth/confirmarCuenta', {
            pagina: 'Error al confirmar tu cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta, por favor intenta de nuevo',
            error: true
        })
    }

    //Confirmar la cuenta
    usuario.token = null;
    usuario.confirmado = true;

    await usuario.save();

    res.render('auth/confirmarCuenta', {
        pagina: ' Cuenta Confirmada',
        mensaje: 'La cuenta se confirmo Correctamente'
    })
}

const formularioOlvidoPassword = (req, res) => {
    res.render('auth/recuperarPassword', {
        pagina: 'Recupera tu acceso a Bienes Raices',
        csrfToken: req.csrfToken()
    })
}

const resetearPassword = async (req, res) => {
    //Validación de Email
    await check('email').isEmail().withMessage('Ingrese un email válido').run(req);

    let resultado = validationResult(req);

    if(!resultado.isEmpty()){
        //Hay errores
        return res.render('auth/recuperarPassword', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }

    const { email } = req.body;

    const usuario = await Usuario.findOne({
        where: {email}
    });

    if(!usuario){
        //Hay errores
        return res.render('auth/recuperarPassword', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El Email no Pertenece a ningún usuario'}]
        })
    }

    //Generar un Token y enviar el email
    usuario.token = generarId();
    await usuario.save();

    //Enviar un email
    emailOlvideMiPassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    });

    //Renderizar un mensaje
    res.render('templates/mensaje', {
        pagina: 'Restablece tu Password',
        mensaje: 'Hemos Enviado un Email con las instrucciones'
    })
}

const confirmarTokenResetPassword = async (req, res) => {
    const { token } = req.params;

    const usuario = await Usuario.findOne({
        where: {token}
    })

    if(!usuario){
        return res.render('auth/confirmarCuenta', {
            pagina: 'Reestablece tu Password',
            mensaje: 'Hubo un error al validar tu información, por favor intenta de nuevo',
            error: true
        })
    }

    // Mostrar formulario para modificar el password
    res.render('auth/resetPassword', {
        pagina: 'Reestablece Tu Password',
        csrfToken: req.csrfToken(),
    })
}

const generarNuevoPassword = async(req, res) => {
    //Validar el password

    await check('password').isLength({min: 8}).withMessage('El Password debe ser de al menos 8 caracteres').run(req);

    let resultado = validationResult(req);

    //Verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        //Hay errores
        return res.render('auth/resetPassword', {
            pagina: 'Reestablece tu password',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        })
    }

    const { token } = req.params;
    const { password } = req.body;

    //Identificar quien hace el cambio
    const usuario = await Usuario.findOne({
        where: {token}
    });

    // Hashear el Password
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);
    usuario.token = null;
    
    //Guardar cambios
    await usuario.save();

    res.render('auth/confirmarCuenta', {
        pagina: 'Password Reestablecido',
        mensaje: '¡Tu password se reestableció correctamente!'
    })

}

export {
    formularioLogin,
    autenticarUsuario,
    cerrarSesion,
    formularioRegistro,
    registrarUsuario,
    confirmarToken,
    formularioOlvidoPassword,
    resetearPassword,
    confirmarTokenResetPassword,
    generarNuevoPassword
}