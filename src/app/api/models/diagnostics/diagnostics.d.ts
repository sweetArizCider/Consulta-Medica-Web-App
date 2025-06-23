import {CreationOptional, ForeignKey} from 'sequelize';
import { ClientAttributes } from '@expressModels/clients/clients';
import { DoctorAttributes } from '@expressModels/doctors/doctors';

export interface DiagnosticAttributes {
  id_diagnostic: CreationOptional<number>;
  client_id: ForeignKey<number>;
  doctor_id: ForeignKey<number>;
  diagnosis_date?: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
  client?: ClientAttributes;
  doctor?: DoctorAttributes;
}

export interface DiagnosticPayload {
  client_id: number;
  doctor_id: number;
  diagnosis_date?: string;
  description?: string | null;
}

export interface DiagnosticResponse {
  diagnostic: Omit<DiagnosticAttributes, 'client' | 'doctor'>;
  client: ClientAttributes | null;
  doctor: DoctorAttributes | null;
}
