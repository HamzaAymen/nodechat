import { Sequelize } from "sequelize";

const sequelize = new Sequelize("node_chat", "username", "password", {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

export { sequelize };
