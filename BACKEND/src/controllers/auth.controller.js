import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

/**
 * In-memory users (POC only)
 */
export const users = [];

export const register = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new ApiError(400, "Email and password are required");

  const existingUser = users.find((u) => u.email === email);
  if (existingUser)
    throw new ApiError(400, "User already exists");

  const newUser = {
    id: Date.now(),
    email,
    password: bcrypt.hashSync(password, 10),
    name: "New User"
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: "User registered successfully"
  });
};

export const login = (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user)
    throw new ApiError(400, "Invalid email or password");

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch)
    throw new ApiError(400, "Invalid email or password");

  const token = jwt.sign(
    { id: user.id, email: user.email },
    "SECRET_KEY",
    { expiresIn: "1h" }
  );

  res.json({
    success: true,
    token
  });
};
