import { CreationOptional } from 'sequelize';

export interface DoctorAttributes {
  id_doctor: CreationOptional<number>;
  name: string;
  email: string;
  phone?: string | null;
  specialty?: string | null;
  created_at?: CreationOptional<string>;
  updated_at?: CreationOptional<string>;
  is_active?: CreationOptional<boolean>;
}

export interface DoctorPayload {
  name: string;
  email: string;
  phone?: string | null;
  specialty?: string | null;
}
