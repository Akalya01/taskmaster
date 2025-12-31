import bcrypt from "bcryptjs";
import { users } from "./auth.controller.js";
import { cache } from "../config/cache.js";
import { ApiError } from "../utils/ApiError.js";

export const getProfile = (req, res) => {
  const userId = req.user.id;

  // Check cache
  const cachedProfile = cache.get(userId);
  if (cachedProfile) {
    return res.json({
      success: true,
      data: cachedProfile,
      cached: true
    });
  }

  const user = users.find((u) => u.id === userId);
  if (!user)
    throw new ApiError(404, "User not found");

  const profile = {
    id: user.id,
    email: user.email,
    name: user.name
  };

  cache.set(userId, profile);

  res.json({
    success: true,
    data: profile,
    cached: false
  });
};

export const updateProfile = (req, res) => {
  const userId = req.user.id;
  const { name } = req.body;

  const user = users.find((u) => u.id === userId);
  if (!user)
    throw new ApiError(404, "User not found");

  user.name = name;

  // Invalidate cache
  cache.del(userId);

  res.json({
    success: true,
    message: "Profile updated successfully",
    data: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  });
};

export const changePassword = (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current and new password are required");
  }

  const user = users.find((u) => u.id === userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = bcrypt.compareSync(currentPassword, user.password);
  if (!isMatch) {
    throw new ApiError(400, "Incorrect current password");
  }

  user.password = bcrypt.hashSync(newPassword, 10);

  res.json({
    success: true,
    message: "Password changed successfully"
  });
};
