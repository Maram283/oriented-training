import { Response } from 'express';

export class BaseController {
  protected sendResponse<T>(res: Response, statusCode: number, data: T, message?: string) {
    return res.status(statusCode).json({
      success: true,
      message: message || 'Operation successful',
      data,
    });
  }

  protected sendError(res: Response, statusCode: number, error: string) {
    return res.status(statusCode).json({
      success: false,
      error,
    });
  }
}