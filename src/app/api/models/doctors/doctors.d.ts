import { CreationOptional } from 'sequelize';

export interface DoctorAttributes {
  id_doctor: CreationOptional<number>;
  name: string;
  email: string;
  phone?: string | null;
  specialty?: string | null;
  created_at?: Date;
  updated_at?: Date;
  is_active?: boolean;
}
