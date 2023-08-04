import { DataTypes } from "sequelize";
import db from "../database/index.js";
import Users from "./users.model.js";

const Sallaries = db.sequelize.define('sallaries', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Users,
      key: 'id'
    }
  },
  sallary: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  }
});

Sallaries.belongsTo(Users, {
  foreignKey: 'userId',
  as: 'user'
});

export default Sallaries;