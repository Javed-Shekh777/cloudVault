// errors/AppErrors.js
class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends AppError { constructor(msg, details) { super(msg || "Bad Request", 400, details); } }
class UnauthorizedError extends AppError { constructor(msg, details) { super(msg || "Unauthorized", 401, details); } }
class ForbiddenError extends AppError { constructor(msg, details) { super(msg || "Forbidden", 403, details); } }
class NotFoundError extends AppError { constructor(msg, details) { super(msg || "Not Found", 404, details); } }
class ConflictError extends AppError { constructor(msg, details) { super(msg || "Conflict", 409, details); } }

module.exports = { AppError, BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, ConflictError };
