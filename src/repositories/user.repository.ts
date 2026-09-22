import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRepository {
  static async findByUserName(userName: string) {
    return await prisma.user.findUnique({
      where: { userName },
    });
  }

  static async createUser(userName: string, password: string) {
    return await prisma.user.create({
      data: {
        userName,
        password,
      },
    });
  }
}