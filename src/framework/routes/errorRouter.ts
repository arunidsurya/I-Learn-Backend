import express from "express";

const errorRouter = express.Router();

errorRouter.use((req, res, next) => {
  const error = new Error("Route not found");
  next(error);
});

export default errorRouter;
