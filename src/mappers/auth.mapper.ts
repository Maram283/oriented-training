export class AuthMapper {
  static toLoginResponseDto(user: { id: number; userName: string; createdAt: Date }, token: string, expiredDate: string) {
    return {
      id: user.id,
      userName: user.userName,
      createdAt: user.createdAt,
      expiredDate,
      token,
    };
  }
}