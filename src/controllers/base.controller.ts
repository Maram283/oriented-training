import { Response } from 'express';

export class BaseController {
  protected sendResponse<T>(res: Response, statusCode: number, data: T, message?: string) {
    if (data) {
      return res.status(statusCode).json(data);
    }
    return res.status(statusCode).json({ message: message || 'Operation successful' });
  }

  protected sendError(res: Response, statusCode: number, error: string) {
    return res.status(statusCode).json({
      success: false,
      error,
    });
  }
}