import jwt from 'jsonwebtoken';

const generarId = () => {
   const token =  Math.random().toString(32).substring(2) + Date.now().toString(32);

   return token;
}

const generarJWT = (datos) => {
    return jwt.sign({
        id: datos.id,
        nombre: datos.nombre
    }, process.env.JWT_SECRET, {
        //Tiempo en el que expira el token
        expiresIn: '1d'
    });
}

export {
    generarId,
    generarJWT
}