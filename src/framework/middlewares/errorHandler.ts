import { Request, Response, NextFunction } from "express";

class CustomError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const errorHandler = (
  err: CustomError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    res.status(err.status).json({
      error: {
        message: err.message,
      },
    });
  } else {
    res.status(500).json({
      error: {
        message: "Internal Server Error",
      },
    });
  }
};

export default errorHandler;
