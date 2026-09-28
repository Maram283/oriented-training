import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HTTP_STATUS } from '../utils/status-codes';

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: 'Access token is missing or invalid',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret'
    ) as { userId: number; role?: string; [key: string]: any };

    req.user = decoded;
    next();
  } catch (error) {
    res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};