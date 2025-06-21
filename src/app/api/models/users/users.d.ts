import Users from '@sequelizeModels/Users.model';

export interface User extends UserPayload{
  id: number;
  created_at: Date;
  active: boolean;
}

export interface UserPayload {
  username: string;
  email: string;
  password: string;
}

export interface UserLoginPayload {
  username: string;
  password: string;
}

export interface UserWithToken {
  user: Users;
  token: string;
}
