import bcrypt from 'bcrypt'

const usuarios = [
    {
        nombre: 'Admin',
        email: 'correo@correo.com',
        confirmado: 1,
        password: bcrypt.hashSync('12345678', 10)
    }
];

export default usuarios;