import { DataTypes } from "sequelize";
import db from "../database/index.js";

const Roles = db.sequelize.define('roles', {
  roleName: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

export default Roles;