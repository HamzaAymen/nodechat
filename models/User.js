import { Sequelize } from "sequelize";
import { sequelize } from "../db/db.js";

export const User = sequelize.define("user", {
  userId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  hashPassword: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// module.exports = User;
