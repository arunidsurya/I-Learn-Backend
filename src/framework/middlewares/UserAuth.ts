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
  const access_token = req.cookies.access_token as string;
  const refresh_token = req.cookies.refresh_token as string;

  if (!access_token) {
    // console.log("unauthorisez-1");

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
    const currentUserData = await userModel.findOne({email:userEmail});

    console.log(currentUserData);
    if(currentUserData?.isBlocked){
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        // console.log("unauthorisez-3");
        return res
          .status(401)
          .send({ success: false, message: "Profile is blocked" });
    }
    

    if (!user) {
      // console.log("unauthorisez-2");
      return res
        .status(401)
        .send({ success: false, message: "User not found" });
    }

    req.user = JSON.parse(user);
    return next();
  } catch (error) {
    // Handle TokenExpiredError
    if (error instanceof TokenExpiredError) {
      // Access token is expired, check refresh token
      if (!refresh_token) {
        // No refresh token, clear cookies and send unauthorized response
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        console.log("unauthorisez-3");
        return res
          .status(401)
          .send({ success: false, message: "Unauthorized - Invalid token" });
      }


      try {
        const refreshDecoded = jwt.verify(
          refresh_token,
          process.env.REFRESH_TOKEN as Secret
        ) as JwtPayload;

        // Fetch user data from Redis using the email address from the refresh token
        const userEmail = refreshDecoded.user.email;
        const user = await redis.get(`user-${userEmail}`);

        if (!user) {
          console.log("unauthorisez-4");
          return res
            .status(401)
            .send({ success: false, message: "User not found" });
        }

        // Refresh token is valid, generate new access token
        const newAccessToken = jwt.sign(
          { user: JSON.parse(user) },
          process.env.ACTIVATION_SECRET as Secret,
          { expiresIn: "5m" }
        );

        // Set the new access token in the cookie
        res.cookie("access_token", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Set to true in production
          sameSite: "strict",
        });

        // Proceed to next function
        return next();
      } catch (refreshError) {
        // Refresh token is expired, clear cookies and send unauthorized response
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        console.log("unauthorisez-5");
        return res
          .status(401)
          .send({ success: false, message: "Unauthorized - Invalid token" });
      }
    }

    // Handle other errors
    console.error(error);
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error" });
  }
};

