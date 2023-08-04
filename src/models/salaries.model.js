import { DataTypes } from "sequelize";
import db from "../database/index.js";
import Users from "./users.model.js";

const Salaries = db.sequelize.define('salaries', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Users,
      key: 'id'
    }
  },
  salary: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  }
}, {
  timestamps: false
});

Salaries.belongsTo(Users, {
  foreignKey: 'userId',
  as: 'user'
});

export default Salaries;