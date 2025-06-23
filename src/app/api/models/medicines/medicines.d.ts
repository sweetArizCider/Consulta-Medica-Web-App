import {CreationOptional} from 'sequelize';

export interface MedicineAttributes {
  id_medicine: CreationOptional<number>;
  name: string;
  description?: string | null;
  price: number;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
}

export interface MedicinePayload {
  name: string;
  description?: string | null;
  price: number;
}
