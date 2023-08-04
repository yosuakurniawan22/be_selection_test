import { DataTypes } from "sequelize";
import db from "../database/index.js";
import Roles from "./roles.model.js";

const Users = db.sequelize.define('users', {
  email: {
    type: DataTypes.STRING,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  birthdate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  joindate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  roleId: {
    type: DataTypes.INTEGER,
    references: {
      model: Roles,
      key: 'id'
    }
  }
});

Users.belongsTo(Roles, {
  foreignKey: 'roleId',
  as: 'role'
});

export default Users;