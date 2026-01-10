import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/api-errors.js";
import { User } from "../models/user.model.js";

export const verifyToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "No token provided");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "Token missing");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired token");
  }

  const user = await User.findById(decoded?._id).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  req.user = user;
  next();
});
