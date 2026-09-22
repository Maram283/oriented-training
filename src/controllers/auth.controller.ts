import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthMapper } from '../mappers/auth.mapper';

export const login = async (req: Request, res: Response): Promise<any> => {
  const { userName, password } = req.body;

  const result = await AuthService.authenticateUser(userName, password);

  if ('success' in result && result.success === false) {
    return res.status(401).json({
      success: false,
      message: result.message,
    });
  }

  // هنا Controller استخدم الـ Mapper لبناء الـ ResponseDTO وإرساله للعميل
  const responseDto = AuthMapper.toLoginResponseDto(result.user, result.token, result.expiredDate);

  return res.status(200).json(responseDto);
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