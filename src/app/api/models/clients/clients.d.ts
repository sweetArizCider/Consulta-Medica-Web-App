import {CreationOptional} from 'sequelize';

export interface ClientAttributes {
  id_client: CreationOptional<number>;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  created_at?: string;
  updated_at?: string;
  is_active?: CreationOptional<boolean>;
}

export interface ClientPayload {
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
}
