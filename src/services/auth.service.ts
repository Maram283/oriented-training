import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { UserResponseDto } from '../dtos/user.dto';

const prisma = new PrismaClient();

export class AuthService {
  static async authenticateUser(userName: string, password: string): Promise<{ success: boolean; message?: string; data?: UserResponseDto }> {
    const user = await prisma.user.findUnique({ where: { userName } });
    if (!user) {
      return { success: false, message: 'Invalid userName or password' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, message: 'Invalid userName or password' };
    }

    return { 
      success: true, 
      data: { 
        id: user.id, 
        userName: user.userName, 
        createdAt: user.createdAt 
      } 
    };
  }

  static async registerUser(userName: string, password: string): Promise<{ success: boolean; message?: string; data?: UserResponseDto }> {
    const existingUser = await prisma.user.findUnique({ where: { userName } });
    if (existingUser) {
      return { success: false, message: 'Username is already taken' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        userName,
        password: hashedPassword,
      },
    });

    return { 
      success: true, 
      data: { 
        id: newUser.id, 
        userName: newUser.userName, 
        createdAt: newUser.createdAt 
      } 
    };
  }
}