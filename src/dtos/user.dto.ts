export interface UserResponseDto {
  id: number;
  userName: string;
  createdAt: Date;
}

export class LoginRequestDto {
  userName!: string;
  password!: string;

  constructor(body: any) {
    this.userName = body.userName;
    this.password = body.password;
  }
}

export class RegisterRequestDto {
  userName!: string;
  password!: string;

  constructor(body: any) {
    this.userName = body.userName;
    this.password = body.password;
  }
}
