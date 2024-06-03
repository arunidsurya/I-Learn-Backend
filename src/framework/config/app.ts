import express, { urlencoded, Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "../routes/userRoutes";
import adminRouter from "../routes/adminRoutes";
import tutorRouter from "../routes/tutorRoutes";
import errorRouter from "../routes/errorRouter";
import errorHandler from "../middlewares/errorHandler";
import { request } from "http";
require("dotenv").config();

class CustomError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const createServer = () => {
  try {
    const app = express();
    const corsOptions = {
      origin: process.env.ORIGIN || "*",
      credentials: true,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
      allowedHeaders:
        "Origin,X-Requested-With,Content-Type,Accept,Authorization",
      optionsSuccessStatus: 200,
    };
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors(corsOptions));
    app.options('*',cors(corsOptions))
    app.use(cookieParser());


    app.use("/api/v1", userRouter);
    app.use("/api/v1", adminRouter);
    app.use("/api/v1", tutorRouter);


    app.use("*", errorRouter);
    app.use(errorHandler);

    return app;
  } catch (error) {
    console.log("error");
  }
};
