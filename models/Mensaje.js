import { DataTypes } from "sequelize";
import database from "../config/Database.js";

const Mensaje = database.define('Mensajes', {
    mensaje: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    
});

export default Mensaje;