import express from "express";
import { formularioLogin, autenticarUsuario, cerrarSesion,registrarUsuario, confirmarToken,formularioRegistro, formularioOlvidoPassword, resetearPassword, confirmarTokenResetPassword, generarNuevoPassword } from "../controllers/UsuarioController.js";


const router = express.Router();

//Route Login
router.get('/login', formularioLogin);
router.post('/login', autenticarUsuario);

//Route Cerrar Sesión
router.post('/cerrarSesion', cerrarSesion);

//Route Registro
router.get('/registro', formularioRegistro);
router.post('/registro', registrarUsuario);
router.get('/confirmar/:token', confirmarToken);
router.get('/recuperarPassword', formularioOlvidoPassword);
router.post('/recuperarPassword', resetearPassword);

//Almacena el nuevo password
router.get('/recuperarPassword/:token', confirmarTokenResetPassword);
router.post('/recuperarPassword/:token', generarNuevoPassword);

export default router;