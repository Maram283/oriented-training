export interface UserResponseDto {
  id: number;
  userName: string;
  createdAt: Date;
}

export class LoginRequestDto {
  userName!: string;
  password!: string;
}

export class RegisterRequestDto {
  userName!: string;
  password!: string;
}
