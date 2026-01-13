import { ApiError } from "../utils/api-errors.js";

export const errorHandler = (err, req, res, next) => {
  // ApiError format
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }

  // fallback
  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
