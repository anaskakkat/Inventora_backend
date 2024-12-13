import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // console.log("Cookies from Request:-----------------", req.cookies);

    const token = req.cookies.token;
    // console.log("Token from middleware:===========", token);

    if (!token) {
      res.status(401).json({ message: " No token provided" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as { id: string };
    // console.log("decoded---", decoded);

    req.userId = decoded.id; // Attach userId to request

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
