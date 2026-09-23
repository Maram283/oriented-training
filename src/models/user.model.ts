export class UserModel {
  constructor(
    public id: number,
    public userName: string,
    public password: string,
    public role: string, 
    public createdAt: Date
  ) {}

  static fromPrisma(prismaUser: any): UserModel | null {
    if (!prismaUser) {
      return null;
    }
    return new UserModel(
      prismaUser.id,
      prismaUser.userName,
      prismaUser.password,
      prismaUser.role, 
      prismaUser.createdAt
    );
  }
}