import { Sequelize } from "sequelize";
import { sequelize } from "../db/db.js";
import { User } from "./User.js";

export const Room = sequelize.define("room", {
  roomId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
});

Room.belongsToMany(User, {
  through: "user_room",
  foreignKey: "roomId",
});
User.belongsToMany(Room, {
  through: "user_room",
  foreignKey: "userId",
});
