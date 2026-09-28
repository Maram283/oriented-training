import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { AuthService } from '../services/auth.service';
import { HTTP_STATUS } from '../utils/status-codes';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { LoginRequestDto, RegisterRequestDto } from '../dtos/user.dto';

class AuthController extends BaseController {
  public register = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const dto = new RegisterRequestDto(req.body);
    const result = await AuthService.registerUser(dto.userName, dto.password);

    if (!result.success) {
      throw new AppError(result.message, HTTP_STATUS.BAD_REQUEST);
    }

    this.sendResponse(res, HTTP_STATUS.CREATED, result.data, result.message);
  });

  public login = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const dto = new LoginRequestDto(req.body);
    const result = await AuthService.authenticateUser(dto.userName, dto.password);

    if (!result.success) {
      throw new AppError(result.message, HTTP_STATUS.UNAUTHORIZED);
    }

    const { user, token, expiredDate } = result;
    this.sendResponse(res, HTTP_STATUS.OK, { user, token, expiredDate }, 'Login successful');
  });
}

export const authController = new AuthController();