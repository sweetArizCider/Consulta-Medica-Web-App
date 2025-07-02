import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalComponent } from './modal';
import { ModalData } from './modal.model';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private dialog: MatDialog) { }

  open(data: ModalData): MatDialogRef<ModalComponent> {
    return this.dialog.open(ModalComponent, {
      width: '757px',
      data: data,
    });
  }
}
