import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { UserResponseDto } from '../dtos/user.dto';

export class AuthService {
  static async authenticateUser(userName: string, password: string): Promise<any> {
    const user = await UserRepository.findByUserName(userName);
    if (!user) {
      return { success: false, message: 'Invalid userName or password' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, message: 'Invalid userName or password' };
    }

    const token = jwt.sign(
      { userId: user.id, userName: user.userName },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );

    const expiredDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    return {
      user,
      token,
      expiredDate
    };
  }

  static async registerUser(userName: string, password: string): Promise<{ success: boolean; message?: string; data?: UserResponseDto }> {
    const existingUser = await UserRepository.findByUserName(userName);
    if (existingUser) {
      return { success: false, message: 'Username is already taken' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserRepository.createUser(userName, hashedPassword);

    return {
      success: true,
      message: 'User registered successfully',
      data: {
        id: newUser.id,
        userName: newUser.userName,
        createdAt: newUser.createdAt,
      }
    };
  }
}