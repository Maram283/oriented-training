import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export const login = async (req: Request, res: Response): Promise<any> => {
  const { userName, password } = req.body;

  const result = await AuthService.authenticateUser(userName, password);

  if (!result.success) {
    return res.status(401).json({
      success: false,
      message: result.message,
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Login successful',
    data: result.data,
  });
};