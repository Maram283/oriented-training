export class UserModel {
  constructor(
    public id: number,
    public userName: string,
    public password: string,
    public createdAt: Date
  ) {}

  // دالة لتحويل كائن بريزما إلى كلاس الـ Model الخاص بنا
  static fromPrisma(prismaUser: any): UserModel {
    return new UserModel(
      prismaUser.id,
      prismaUser.userName,
      prismaUser.password,
      prismaUser.createdAt
    );
  }
}