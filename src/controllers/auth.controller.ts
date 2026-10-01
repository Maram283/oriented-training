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

    if (result.requires2FA) {
      this.sendResponse(res, HTTP_STATUS.OK, { tempToken: result.tempToken }, '2FA required');
      return;
    }

    const { user, token, expiredDate } = result;
    this.sendResponse(res, HTTP_STATUS.OK, { user, token, expiredDate }, 'Login successful');
  });

  public verify2FALogin = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { tempToken, code } = req.body;
    if (!tempToken || !code) {
      throw new AppError('tempToken and code are required', HTTP_STATUS.BAD_REQUEST);
    }

    const result = await AuthService.verify2FALogin(tempToken, code);
    if (!result.success) {
      throw new AppError(result.message, HTTP_STATUS.UNAUTHORIZED);
    }

    const { user, token, expiredDate } = result;
    this.sendResponse(res, HTTP_STATUS.OK, { user, token, expiredDate }, 'Login successful');
  });

  public generate2FA = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const userName = req.user?.userName;
    
    if (!userId || !userName) throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);

    const result = await AuthService.generate2FASecret(userId, userName);
    this.sendResponse(res, HTTP_STATUS.OK, result, 'QR Code generated. Please scan it with Google Authenticator.');
  });

  public verify2FASetup = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const { code } = req.body;

    if (!userId) throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);
    if (!code) throw new AppError('Code is required', HTTP_STATUS.BAD_REQUEST);

    const isValid = await AuthService.verify2FASetup(userId, code);
    if (!isValid) {
      throw new AppError('Invalid 2FA code', HTTP_STATUS.BAD_REQUEST);
    }

    this.sendResponse(res, HTTP_STATUS.OK, null, '2FA has been enabled successfully');
  });
}

export const authController = new AuthController();