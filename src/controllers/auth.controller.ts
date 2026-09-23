import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthMapper } from '../mappers/auth.mapper';
import { LoginRequestDto, RegisterRequestDto } from '../dtos/user.dto';

export const login = async (req: Request, res: Response): Promise<any> => {
  const dto: LoginRequestDto = req.body;
  const result = await AuthService.authenticateUser(dto.userName, dto.password);

  if ('success' in result && result.success === false) {
    return res.status(401).json({
      success: false,
      message: result.message,
    });
  }

  const responseDto = AuthMapper.toLoginResponseDto(result.user, result.token, result.expiredDate);
  return res.status(200).json(responseDto);
};

export const register = async (req: Request, res: Response): Promise<any> => {
  const dto: RegisterRequestDto = req.body;
  const result = await AuthService.registerUser(dto.userName, dto.password);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.message,
    });
  }

  return res.status(201).json(result.data);
};