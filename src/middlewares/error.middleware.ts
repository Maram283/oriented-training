import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../utils/status-codes';
import { AppError } from '../utils/AppError';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Global Error Handler:', err);

  // If the error is an operational error we threw using AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // If it's a Prisma validation or Zod error not caught earlier, or any other unknown error
  // We hide the exact details in production to prevent leaking sensitive info
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  
  // Only expose the message if it's explicitly set by a known source, otherwise generic message
  const message = 
    statusCode === HTTP_STATUS.INTERNAL_SERVER_ERROR
      ? 'Internal Server Error' 
      : (err.message || 'Something went wrong');

  res.status(statusCode).json({
    success: false,
    message,
  });
};