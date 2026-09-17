import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateInput = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): any => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        errors: error.errors ? error.errors.map((e: any) => e.message) : 'Invalid input',
      });
    }
  };
};