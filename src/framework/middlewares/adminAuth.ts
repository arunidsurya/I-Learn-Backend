import { Response, NextFunction, Request } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { redis } from "../config/redis";
import Admin from "../../entities/adminEntity";

require("dotenv").config();

//authenticated user

declare module "express-serve-static-core" {
  interface Request {
    admin?: Admin;
  }
}

export const isAuthorized = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const admin_accessToken = req.cookies.admin_AccessToken as string;
  // console.log("access_token:", admin_accessToken);

  if (!admin_accessToken) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - No token provided" });
  }
  try {
    const decoded = jwt.verify(
      admin_accessToken,
      process.env.ACTIVATION_SECRET as Secret
    ) as JwtPayload;

    // console.log(decoded);

    if (!decoded) {
      return res
        .status(401)
        .send({ success: false, message: "Unauthorized - Invalid token" });
    }
    // console.log(decoded.user.email);

    const admin = await redis.get(decoded.admin.email);

    // console.log(user);

    if (!admin) {
      return res
        .status(401)
        .send({ success: false, message: "User not found" });
    } else {
      req.admin = JSON.parse(admin);
      next();
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error" });
  }
};
