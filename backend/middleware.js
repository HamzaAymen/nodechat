import dotev from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import { json, urlencoded } from "express";
dotev.config();

export default function (app) {
  app.use(cookieParser());
  app.use(urlencoded({ extended: false, limit: "1kb" }));
  app.use(json({ limit: "1kb" }));
  app.use(helmet());

  // Let the client use our api
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
}
