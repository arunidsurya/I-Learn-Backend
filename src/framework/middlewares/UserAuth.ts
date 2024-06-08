import { Response, NextFunction, Request } from "express";
import jwt, { JwtPayload, Secret, TokenExpiredError } from "jsonwebtoken";
import { redis } from "../config/redis";
import User from "../../entities/userEntity";
import userModel from "../database/userModel";
require("dotenv").config();

//authenticated user

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const access_token = req.headers.authorization?.split(" ")[1] as string;
  const refresh_token = req.cookies.refresh_token as string;

  // console.log("access_token:", access_token);

  if (!access_token) {
    console.log("un authorized-1");
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - No token provided" });
  }

  try {
    const decoded = jwt.verify(
      access_token,
      process.env.ACTIVATION_SECRET as Secret
    ) as JwtPayload;

    // Proceed if the access token is valid
    const userEmail = decoded.user.email;
    const user = await redis.get(`user-${userEmail}`);
    const currentUserData = await userModel.findOne({ email: userEmail });

    if (currentUserData?.isBlocked) {
      console.log("un authorized-2");
      return res
        .status(401)
        .send({ success: false, message: "Profile is blocked" });
    }

    if (!user) {
      console.log("un authorized-3");
      return res
        .status(401)
        .send({ success: false, message: "User not found" });
    }

    req.user = JSON.parse(user);
    return next();
  } catch (error) {
    // Handle TokenExpiredError
    if (error instanceof TokenExpiredError) {
      if (!refresh_token) {
        console.log("un authorized-4");
        return res
          .status(401)
          .send({ success: false, message: "Unauthorized - Invalid token" });
      }

      try {
        const refreshDecoded = jwt.verify(
          refresh_token,
          process.env.REFRESH_TOKEN as Secret
        ) as JwtPayload;

        const userEmail = refreshDecoded.user.email;
        const user = await redis.get(`user-${userEmail}`);

        if (!user) {
          console.log("un authorized-5");
          return res
            .status(401)
            .send({ success: false, message: "User not found" });
        }

        const newAccessToken = jwt.sign(
          { user: JSON.parse(user) },
          process.env.ACTIVATION_SECRET as Secret,
          { expiresIn: "5m" }
        );

        // Store the new access token in res.locals
        res.locals.newAccessToken = newAccessToken;
        req.user = JSON.parse(user);

        return next();
      } catch (refreshError) {
        console.log("un authorized-6");
        return res
          .status(401)
          .send({ success: false, message: "Unauthorized - Invalid token" });
      }
    }

    console.error(error);
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error" });
  }
};
