import Users from '@sequelizeModels/Users.model';
import {CreationOptional} from 'sequelize';

export interface User extends UserPayload{
  user_id: number;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
}

export interface UserPayload {
  username: string;
  email: string;
  password_hash: string;
  photo_profile_url?: string | null;
}

export interface UserLoginPayload {
  username: string;
  password_hash: string;
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
  created_at?: string;
  updated_at?: string;
  photo_profile_url?: string | null;
  is_active?: boolean;
}

