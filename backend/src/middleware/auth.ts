import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export const userAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;

  // Expect: Authorization: Bearer <token>
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "You are not authorized"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId; 
    next();
  } catch (error) {
    return res.status(401).json({
      message: "User not verified"
    });
  }
};
