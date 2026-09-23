import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthMapper } from '../mappers/auth.mapper';

export const getAllUsers = async (req: Request, res: Response): Promise<any> => {
  const users = await AuthService.getAllUsers();
  const responseDtos = users.map((user) => AuthMapper.toUserResponseDto(user));
  
  return res.status(200).json({
    success: true,
    data: responseDtos,
  });
};

export const getUserById = async (req: Request, res: Response): Promise<any> => {
const id = parseInt(req.params.id as string);
  const user = await AuthService.getUserById(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  const responseDto = AuthMapper.toUserResponseDto(user);
  return res.status(200).json({
    success: true,
    data: responseDto,
  });
};