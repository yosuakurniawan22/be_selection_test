import { Sequelize } from "sequelize";
import dbConfig from "../config/db.config.js";

let db = {};
const sequelize = new Sequelize(dbConfig.DB_NAME, dbConfig.DB_USERNAME, dbConfig.DB_PASSWORD, dbConfig);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;