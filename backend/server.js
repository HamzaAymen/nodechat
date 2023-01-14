import express from "express";
import middleware from "./middleware.js";
import "./socket.io.js";
import { router } from "../routes/routers.js";
const app = express();
const PORT = process.env.NODE_PORT || 4000;

// Parsing Body & Json & Cookie & Using Helmet & Using Dotenv & Setting Cors
middleware(app);

// Using the Routes
app.use("/", router);

// Start node server
app.listen(PORT, async () => {
  try {
    // await sequelize.sync({ alter: true });
    console.log(`Connected to port ${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
