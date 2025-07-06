import { ValidatorFn } from '@angular/forms';

export interface ModalField {
  name: string;
  label: string;
  type?: 'text' | 'password' | 'email' | 'number';
  initialValue?: any;
  validators?: ValidatorFn[];
}

export interface ModalData {
  title: string;
  fields: ModalField[];
  confirmButtonText?: string;
  cancelButtonText?: string;
}
