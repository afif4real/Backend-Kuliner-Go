import {Sequelize} from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Admin = db.define('admin',{
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
},{
    freezeTableName:true
});

export default Admin;
// (async () => {
//     await db.sync();
// })();