import { PrismaClient } from '@prisma/client';
import { UserModel } from '../models/user.model';

const prisma = new PrismaClient();

export class UserRepository {
  static async findByUserName(userName: string): Promise<UserModel | null> {
    const user = await prisma.user.findUnique({
      where: { userName },
    });
    return UserModel.fromPrisma(user);
  }

  static async createUser(userName: string, password: string): Promise<UserModel> {
    const user = await prisma.user.create({
      data: {
        userName,
        password,
      },
    });
    return UserModel.fromPrisma(user);
  }
}