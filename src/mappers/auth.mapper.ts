import { UserModel } from '../models/user.model';
import { UserResponseDto } from '../dtos/user.dto';

export class AuthMapper {
  static toLoginResponseDto(user: any, token: string, expiredDate: string) {
    return {
      token,
      expiredDate,
      id: user.id,
      userName: user.userName,
      createdAt: user.createdAt
    };
  }


  static toUserResponseDto(user: UserModel): UserResponseDto {
    return {
      id: user.id,
      userName: user.userName,
      createdAt: user.createdAt,
    };
  }
}