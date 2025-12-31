import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    throw new ApiError(401, "Unauthorized - Token missing");

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "SECRET_KEY");
    req.user = decoded;
    next();
  } catch {
    throw new ApiError(401, "Unauthorized - Invalid token");
  }
};
