import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

interface ErrorResponse {
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
  status: number;
}

export function errorHandler(
  error: Error,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) {
  console.error('Error:', error);

  // Default error response
  const response: ErrorResponse = {
    error: {
      message: 'Internal Server Error',
    },
    status: 500,
  };

  // Handle known error types
  if (error instanceof AppError) {
    response.error.message = error.message;
    response.status = error.statusCode;
  } else if (error instanceof ZodError) {
    response.error.message = 'Validation Error';
    response.error.details = error.errors;
    response.status = 400;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        response.error.message = 'Unique constraint violation';
        response.status = 409;
        break;
      case 'P2025':
        response.error.message = 'Record not found';
        response.status = 404;
        break;
      default:
        response.error.message = 'Database error';
        response.status = 500;
    }
    response.error.code = error.code;
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    response.error.message = 'Invalid data provided';
    response.status = 400;
  }

  // Add request ID if available
  const requestId = req.headers['x-request-id'];
  if (requestId) {
    response.error.code = `REQ_${requestId}`;
  }

  // Log detailed error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Detailed error:', error);
    response.error.details = error;
  }

  res.status(response.status).json(response);
}

// Async error wrapper
export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Not found handler
export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
}

// Rate limiting error handler
export function rateLimitHandler(req: Request, res: Response) {
  res.status(429).json({
    status: 'error',
    message: 'Too many requests, please try again later.'
  });
} 