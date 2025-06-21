import {CreationOptional, ForeignKey} from 'sequelize';

export interface MedicineRequiredAttributes {
  id_medicine_required: CreationOptional<number>;
  diagnostic_id: ForeignKey<number>;
  medicine_id: ForeignKey<number>;
  dosage?: string | null;
  frequency?: string | null;
  duration?: string | null;
  created_at?: Date;
  updated_at?: Date;
}
