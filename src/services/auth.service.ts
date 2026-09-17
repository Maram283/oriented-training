import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-secret-key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret-key';

export class AuthService {
  static async authenticateUser(userName: string, password: string) {
    // 1. استخدام الـ Repository بدلاً من الفحص اليدوي
    const user = await UserRepository.findByUserName(userName);

    // فحص احتياطي للـ Mock Admin إذا لم تكن قاعدة البيانات متصلة بعد
    const isValidUser = user 
      ? (user.password === password) 
      : (userName === 'admin' && password === '123456');

    if (!isValidUser) {
      return { success: false, message: 'Invalid userName or password' };
    }

    // 2. توليد Access Token و Refresh Token
    const payload = { userName };
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    return {
      success: true,
      data: {
        accessToken,
        refreshToken,
      },
    };
  }
}