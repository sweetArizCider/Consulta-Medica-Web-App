import Users from '@sequelizeModels/Users.model';
import {CreationOptional} from 'sequelize';

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

export interface UserAttributes {
  id_user: CreationOptional<number>;
  username: string;
  email: string;
  password_hash: string;
  created_at?: Date;
  updated_at?: Date;
  photo_profile_url?: string | null;
  is_active?: boolean;
}

