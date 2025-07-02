import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { ModalService } from '@components/modal/modal.service';
import { ModalData } from '@components/modal/modal.model';

@Component({
  selector: 'app-my-feature',
  template: `<button mat-raised-button (click)="openCustomModal()">Open Modal</button>`
})
export class MyFeatureComponent {

  constructor(private modalService: ModalService) { }

  openCustomModal(): void {
    const modalData: ModalData = {
      title: 'Create New User',
      confirmButtonText: 'Create',
      fields: [
        {
          name: 'username',
          label: 'Username',
          initialValue: '',
          validators: [Validators.required, Validators.minLength(3)]
        },
        {
          name: 'email',
          label: 'Email Address',
          type: 'email',
          validators: [Validators.required, Validators.email]
        }
      ]
    };

    const dialogRef = this.modalService.open(modalData);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog result:', result);
        // Handle the returned form data, e.g., call an API
      } else {
        console.log('Dialog was cancelled');
      }
    });
  }
}
