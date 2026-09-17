import { Request, Response, NextFunction } from 'express';
import { loginSchema } from './auth.schema';

export const validateLoginInput = (req: Request, res: Response, next: NextFunction): any => {
  try {
    loginSchema.parse(req.body); // الفحص المباشر بدون كائن body إضافي
    next();
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      errors: error.errors ? error.errors.map((e: any) => e.message) : 'Invalid input',
    });
  }
};