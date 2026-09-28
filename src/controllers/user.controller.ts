import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { AuthService } from '../services/auth.service';
import { AuthMapper } from '../mappers/auth.mapper';
import { HTTP_STATUS } from '../utils/status-codes';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

class UserController extends BaseController {
  public getAllUsers = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const users = await AuthService.getAllUsers();
    const responseDtos = users.map((user: any) => AuthMapper.toUserResponseDto(user));
    
    this.sendResponse(res, HTTP_STATUS.OK, responseDtos, 'Users retrieved successfully');
  });

  public getCurrentUser = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError('Unauthorized user', HTTP_STATUS.UNAUTHORIZED);
    }

    const user = await AuthService.getUserById(userId);
    if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
    }

    const responseDto = AuthMapper.toUserResponseDto(user as any);
    this.sendResponse(res, HTTP_STATUS.OK, responseDto, 'Current user retrieved successfully');
  });

  public getUserById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id as string);
    const user = await AuthService.getUserById(id);

    if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
    }

    const responseDto = AuthMapper.toUserResponseDto(user as any);
    this.sendResponse(res, HTTP_STATUS.OK, responseDto, 'User retrieved successfully');
  });
}

export const userController = new UserController();