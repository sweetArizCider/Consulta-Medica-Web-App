import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { ModalService } from '@components/modal/modal.service';
import { ModalData } from '@components/modal/modal.model';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-my-feature',
  imports: [
    MatButton
  ],
  template: `
    <button mat-raised-button (click)="openCustomModal()">Open Modal</button>`
})
export class MyFeatureComponent {

  constructor(private modalService: ModalService) { }

  openCustomModal(): void {
    const modalData: ModalData = {
      title: 'Añadir doctor',
      confirmButtonText: 'Aceptar',
      fields: [
        {
          name: 'name',
          label: 'Nombre',
          icon: 'person',
          initialValue: '',
          validators: [Validators.required, Validators.minLength(3)]
        },
        {
          name: 'email',
          label: 'Correo electrónico',
          type: 'email',
          icon: 'email',
          validators: [Validators.required, Validators.email]
        },
        {
          name: 'phone',
          label: 'Teléfono',
          type: 'text',
          icon: 'phone',
          initialValue: '',
          validators: [Validators.required, Validators.pattern(/^\d{10}$/)]
        },
        {
          name: 'specialty',
          label: 'Especialidad',
          type: 'text',
          icon: 'stethoscope',
          initialValue: '',
          validators: [Validators.required]
        }
      ]
    };

    const dialogRef = this.modalService.open(modalData);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog result:', result);
      } else {
        console.log('Dialog was cancelled');
      }
    });
  }
}
