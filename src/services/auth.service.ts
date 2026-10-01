import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticator } from 'otplib';
import qrcode from 'qrcode';
import { UserRepository } from '../repositories/user.repository';
import { UserResponseDto } from '../dtos/user.dto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

    if (user.isTwoFactorEnabled) {
      const tempToken = jwt.sign(
        { tempUserId: user.id },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '5m' } // 5 minutes to complete 2FA
      );
      return { success: true, requires2FA: true, tempToken, message: '2FA required' };
    }

    return this.generateAuthResponse(user);
  }

  static async verify2FALogin(tempToken: string, code: string): Promise<any> {
    try {
      const decoded: any = jwt.verify(tempToken, process.env.JWT_SECRET || 'fallback_secret');
      const user = await UserRepository.findById(decoded.tempUserId);

      if (!user || !user.isTwoFactorEnabled || !user.twoFactorSecret) {
        return { success: false, message: 'Invalid 2FA setup' };
      }

      const isValid = authenticator.verify({ token: code, secret: user.twoFactorSecret });
      if (!isValid) {
        return { success: false, message: 'Invalid 2FA code' };
      }

      return this.generateAuthResponse(user);
    } catch (err) {
      return { success: false, message: 'Invalid or expired temporary token' };
    }
  }

  static async generate2FASecret(userId: number, userName: string) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(userName, 'NodeTsPrismaApi', secret);
    const qrCodeUrl = await qrcode.toDataURL(otpauthUrl);

    // Save secret temporarily until verified
    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret },
    });

    return { secret, qrCodeUrl };
  }

  static async verify2FASetup(userId: number, code: string): Promise<boolean> {
    const user = await UserRepository.findById(userId);
    if (!user || !user.twoFactorSecret) return false;

    const isValid = authenticator.verify({ token: code, secret: user.twoFactorSecret });
    
    if (isValid) {
      await prisma.user.update({
        where: { id: userId },
        data: { isTwoFactorEnabled: true },
      });
      return true;
    }
    
    return false;
  }

  private static generateAuthResponse(user: any) {
    const token = jwt.sign(
      {
        userId: user.id,
        userName: user.userName,
        role: user.role,
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );

    const expiredDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const { password: _, twoFactorSecret, ...userWithoutPassword } = user;

    return {
      success: true,
      requires2FA: false,
      user: userWithoutPassword,
      token,
      expiredDate,
    };
  }

  static async registerUser(userName: string, password: string): Promise<{ success: boolean; message: string; data?: UserResponseDto }> {
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
      },
    };
  }

  static async getAllUsers() {
    const users = await UserRepository.findAllUsers();
    return users.map(({ password: _, ...user }) => user);
  }

  static async getUserById(id: number) {
    const user = await UserRepository.findById(id);
    if (!user) return null;
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}