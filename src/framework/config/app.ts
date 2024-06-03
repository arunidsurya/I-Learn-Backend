import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "../routes/userRoutes";
import adminRouter from "../routes/adminRoutes";
import tutorRouter from "../routes/tutorRoutes";
import errorRouter from "../routes/errorRouter";
import errorHandler from "../middlewares/errorHandler";

const createServer = () => {
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

    // Apply CORS middleware
    app.use(cors(corsOptions));

    // Manually add CORS headers for debugging
    app.use((req: Request, res: Response, next: NextFunction) => {
      res.setHeader("Access-Control-Allow-Origin", process.env.ORIGIN || "*");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
      );
      res.setHeader("Access-Control-Allow-Credentials", "true");
      next();
    });

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    // Define routes
    app.use("/api/v1", userRouter);
    app.use("/api/v1", adminRouter);
    app.use("/api/v1", tutorRouter);

    // Error handling routes
    app.use("*", errorRouter);
    app.use(errorHandler);

    return app;
  } catch (error) {
    console.log("Error creating server:", error);
  }
};

export default createServer;
