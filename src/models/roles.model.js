import { DataTypes } from "sequelize";
import db from "../database/index.js";

const Roles = db.sequelize.define('roles', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  roleName: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false
});

export default Roles;