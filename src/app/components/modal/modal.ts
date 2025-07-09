import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ModalData } from './modal.model';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../layouts/button/button.component';
import { InputComponent } from '../../layouts/input/input.component';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.html',
  styleUrls: ['./modal.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    ButtonComponent,
    InputComponent,
    MatIconButton
  ]
})
export class ModalComponent {
  modalForm: FormGroup;
  data: ModalData;

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public injectedData: ModalData
  ) {
    this.data = {
      ...injectedData,
      confirmButtonText: injectedData.confirmButtonText || 'Aceptar',
    };

    const formGroup: { [key: string]: FormControl } = {};
    this.data.fields.forEach(field => {
      formGroup[field.name] = new FormControl(field.initialValue || '', field.validators || []);
    });
    this.modalForm = new FormGroup(formGroup);
  }

  onInputChange(fieldName: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.modalForm.get(fieldName)?.setValue(target.value);
  }

  onConfirm(): void {
    if (this.modalForm.valid) {
      this.dialogRef.close(this.modalForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
