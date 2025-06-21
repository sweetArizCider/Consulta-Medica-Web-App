import {CreationOptional, ForeignKey} from 'sequelize';

export interface DiagnosticAttributes {
  id_diagnostic: CreationOptional<number>;
  client_id: ForeignKey<number>;
  doctor_id: ForeignKey<number>;
  diagnosis_date?: Date;
  description?: string | null;
  created_at?: Date;
  updated_at?: Date;
}
