import { DataTypes } from "sequelize";
import db from "../database/index.js";
import Users from "./users.model.js";

const AttendanceLogs = db.sequelize.define('attendance_logs', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Users,
      key: 'id'
    }
  },
  logDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  clockInTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  clockOutTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  keterangan: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: false
});

AttendanceLogs.belongsTo(Users, {
  foreignKey: 'userId',
  as: 'user'
});

export default AttendanceLogs;