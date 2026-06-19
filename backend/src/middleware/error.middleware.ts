import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/api-error';
import { logger } from '../utils/logger';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Default to 500 internal server error
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details: any = undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;

    // Only log stack for server errors
    if (statusCode >= 500) {
      logger.error(`${statusCode} - ${message}`, { stack: err.stack });
    } else {
      logger.warn(`${statusCode} - ${message}`);
    }
  } else {
    // Unexpected errors
    logger.error('Unhandled error:', { error: err.message, stack: err.stack });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    details = err.message;
  }

  // Mongoose duplicate key error
  if ((err as { code?: number }).code === 11000) {
    statusCode = 409;
    message = 'Resource already exists';
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource ID';
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(details && { details }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
}

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(ApiError.notFound(`Route ${req.originalUrl} not found`));
}
