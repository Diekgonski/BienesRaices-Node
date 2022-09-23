import { DataTypes } from "sequelize";
import database from "../config/Database.js";

const Precio = database.define('Precios', {
    nombre: {
        type: DataTypes.STRING(30),
        allowNull: false
    }, 
    
});

export default Precio;