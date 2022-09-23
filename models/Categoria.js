import { DataTypes } from "sequelize";
import database from "../config/Database.js";

const Categoria = database.define('Categorias', {
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
});

export default Categoria;