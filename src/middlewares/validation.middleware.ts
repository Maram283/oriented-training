import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateInput = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      req.body = schema.parse(req.body);
      return next();
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        errors: error.errors ? error.errors.map((e: any) => e.message) : 'Invalid input',
      });
    }
  };
};