import { CreationOptional, ForeignKey } from 'sequelize';
import { MedicineAttributes } from '@expressModels/medicines/medicines';
import { DiagnosticAttributes } from '@expressModels/diagnostics/diagnostics';
import { ClientAttributes } from '@expressModels/clients/clients';
import { DoctorAttributes } from '@expressModels/doctors/doctors';

export interface MedicineRequiredAttributes {
  id_medicine_required: CreationOptional<number>;
  diagnostic_id: ForeignKey<number>;
  medicine_id: ForeignKey<number>;
  dosage?: string | null;
  frequency?: string | null;
  duration?: string | null;
  created_at?: string;
  updated_at?: string;
  medicine?: MedicineAttributes;
  diagnostic?: DiagnosticAttributes;
}

export interface MedicineRequiredPayload {
  diagnostic_id: number;
  medicine_id: number;
  dosage?: string | null;
  frequency?: string | null;
  duration?: string | null;
}

export interface MedicineRequiredResponse {
  medicineRequired: Omit<MedicineRequiredAttributes, 'medicine' | 'diagnostic'>;
  medicine: MedicineAttributes | null;
}

export interface DiagnosticWithMedicinesResponse {
  diagnostic: Omit<DiagnosticAttributes, 'client' | 'doctor'>;
  client: ClientAttributes | null;
  doctor: DoctorAttributes | null;
  medicinesRequired: MedicineRequiredResponse[];
}

export interface ClientWithMedicinesResponse {
  client: ClientAttributes;
  diagnostics: DiagnosticWithMedicinesResponse[];
}
