import { Response, NextFunction, Request } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { redis } from "../config/redis";
import Tutor from "../../entities/tutorEntity";

require("dotenv").config();

//authenticated user

declare module "express-serve-static-core" {
  interface Request {
    tutor?: Tutor;
  }
}

export const isTutuorAuthorized = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tutor_token = req.cookies.tutor_token as string;
  // console.log("access_token:", admin_accessToken);

  if (!tutor_token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - No token provided" });
  }
  try {
    const decoded = jwt.verify(
      tutor_token,
      process.env.ACTIVATION_SECRET as Secret
    ) as JwtPayload;

    // console.log(decoded);

    if (!decoded) {
      return res
        .status(401)
        .send({ success: false, message: "Unauthorized - Invalid token" });
    }
    // console.log(decoded.user.email);

    const tutor = await redis.get(`tutor-${decoded.tutor.email}`);
    // tutor-${tutor.email}

    // console.log(user);

    if (!tutor) {
      return res
        .status(401)
        .send({ success: false, message: "Tutor not found" });
    } else {
      req.tutor = JSON.parse(tutor);
      next();
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error" });
  }
};
