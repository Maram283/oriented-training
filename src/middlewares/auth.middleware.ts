import { Request, Response, NextFunction } from 'express';
import { loginSchema } from './auth.schema';

export const validateLoginInput = (req: Request, res: Response, next: NextFunction): any => {
  try {
    loginSchema.parse({
      body: req.body,
    });
    
    next(); 
  } catch (error: any) {
    //  400 Bad Request
    return res.status(400).json({
      success: false,
      errors: error.errors ? error.errors.map((e: any) => e.message) : 'Invalid input',
    });
  }
};