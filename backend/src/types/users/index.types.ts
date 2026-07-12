export interface RegisterUserBody {
  email: string;
  password: string;
}

export interface RedisRegisterUserBody extends RegisterUserBody {
  count: number;
  token: string;
  createdAt: string;
}
