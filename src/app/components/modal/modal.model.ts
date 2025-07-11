import { ValidatorFn } from '@angular/forms';

export interface ModalField {
  name: string;
  label: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'select';
  initialValue?: any;
  validators?: ValidatorFn[];
  icon?: string;
  options?: { label: string; value: string | number }[];
}

export interface ModalData {
  title: string;
  fields: ModalField[];
  confirmButtonText?: string;
}
