const mongoose = require("mongoose");
const { AppError, BadRequestError } = require("../errors/AppError");

function formatMongooseError(err) {
  // Duplicate key error
  if (err.code === 11000) {
    const key = Object.keys(err.keyValue || {}).join(", ");
    return new BadRequestError(`Duplicate value for field(s): ${key}`);
  }

  // Validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors || {})
      .map(e => e.message)
      .join(", ");
    return new BadRequestError(messages || "Validation failed");
  }

  // Cast error
  if (err.name === "CastError") {
    return new BadRequestError(`Invalid ${err.path}: ${err.value}`);
  }

  return null;
}


function errorHandler(err, req, res, next) {
  // Prevent double response
  if (res.headersSent) {
    return next(err);
  }

  // Convert mongoose errors
  if (
    err instanceof mongoose.Error ||
    ["MongoServerError", "ValidationError", "CastError"].includes(err.name)
  ) {
    const conv = formatMongooseError(err);
    if (conv) err = conv;
  }

  // Ensure error is AppError if not
  const statusCode = err.statusCode || 500;

  // Not operational → log + generic message
  if (!err.isOperational) {
    console.error("UNEXPECTED ERROR:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }

  // Operational → safe response
  return res.status(statusCode).json({
    status: "fail",
    message: err.message,
    details: err.details || undefined,
  });
}

module.exports = errorHandler;
