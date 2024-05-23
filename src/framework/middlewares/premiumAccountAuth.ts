import { redis } from "../config/redis";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";

export const isPremium = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const access_token = req.cookies.access_token as string;
    const refresh_token = req.cookies.refresh_token as string;
    const decoded = jwt.verify(
      access_token,
      process.env.ACTIVATION_SECRET as Secret
    ) as JwtPayload;

    const userEmail = decoded.user.email;
    const userData = await redis.get(`user-${userEmail}`);

    if (!userData) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const user = JSON.parse(userData);

    if (!user.premiumAccount) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    return next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
