import { NextFunction, Request, Response } from "express";
import * as dotenv from "dotenv";
import { Decrypt } from "../helpers/index";
dotenv.config();
import { AuthRequest } from "~/interfaces";

export const authentification = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {

  /* ---- Check if authorization header is present ---- */
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  /* ---- Get token ---- */
  const token = authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    /* ---- Decrypt token ---- */
    const decoded = await Decrypt.decryptToken(token);

    /* ---- Check if token is valid ---- */
    if (!decoded) {
      return res.status(401).json({ status: "failed", message: "Token is Expired or Invalid", data: null });
    }

    /* ---- Add user to request ---- */
    req.user = decoded as { [key: string]: any };

    /* ---- Move to next middleware ---- */
    next();
  } catch (error) {
    console.error("Error during authentication:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};