import type { Request, Response } from 'express';

export const login = (req: Request, res: Response): any => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(400).json({
      success: false,
      message: 'userName and password are required',
    });
  }

  if (userName === 'admin' && password === '123456') {
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        userName,
        token: 'fake-jwt-token-example',
      },
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid userName or password',
  });
};