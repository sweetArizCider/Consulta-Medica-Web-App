import {CreationOptional} from 'sequelize';

export interface ClientAttributes {
  id_client: CreationOptional<number>;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  created_at?: Date;
  updated_at?: Date;
  is_active?: boolean;
}
