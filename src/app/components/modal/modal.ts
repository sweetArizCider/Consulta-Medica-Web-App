import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ModalData } from './modal.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.html',
  styleUrls: ['./modal.scss'],
  standalone: true, // This was missing
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class ModalComponent {
  modalForm: FormGroup;
  data: ModalData;

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public injectedData: ModalData
  ) {
    // Set default values for button text
    this.data = {
      ...injectedData,
      confirmButtonText: injectedData.confirmButtonText || 'Confirm',
      cancelButtonText: injectedData.cancelButtonText || 'Cancel',
    };

    // Initialize the form
    const formGroup: { [key: string]: FormControl } = {};
    this.data.fields.forEach(field => {
      formGroup[field.name] = new FormControl(field.initialValue || '', field.validators || []);
    });
    this.modalForm = new FormGroup(formGroup);
  }

  onConfirm(): void {
    // Only close and return data if the form is valid
    if (this.modalForm.valid) {
      this.dialogRef.close(this.modalForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
