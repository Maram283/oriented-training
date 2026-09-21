import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export const login = async (req: Request, res: Response): Promise<any> => {
  const { userName, password } = req.body;

  const result = await AuthService.authenticateUser(userName, password);

  if ('success' in result && result.success === false) {
    return res.status(401).json({
      success: false,
      message: result.message,
    });
  }

  return res.status(200).json(result);
};

export const register = async (req: Request, res: Response): Promise<any> => {
  const { userName, password } = req.body;

  const result = await AuthService.registerUser(userName, password);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.message,
    });
  }

  return res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: result.data,
  });
};