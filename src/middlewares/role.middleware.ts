import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../utils/status-codes';
import { AppError } from '../utils/AppError';

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const role = req.user?.role;
  
  if (role !== 'ADMIN') {
    return next(new AppError('Access forbidden: Admins only', HTTP_STATUS.FORBIDDEN));
  }
  
  next();
};
