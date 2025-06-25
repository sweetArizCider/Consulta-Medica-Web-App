import {Component, inject} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'snack-bar-component-example',
  template: `
    <mat-form-field>
      <mat-label>Snack bar duration (seconds)</mat-label>
      <input type="number" [(ngModel)]="durationInSeconds" matInput>
    </mat-form-field>

    <div class="mat-button-row">
      <button mat-stroked-button (click)="openSnackBar('success')" color="primary">Success</button>
      <button mat-stroked-button (click)="openSnackBar('warning')" color="accent">Warning</button>
      <button mat-stroked-button (click)="openSnackBar('danger')" color="warn">Danger</button>
    </div>
  `,
  imports: [MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule],
})
export class SnackBarComponentExample {
  private _snackBar = inject(MatSnackBar);

  durationInSeconds = 5;

  openSnackBar(type: string) {
    this._snackBar.openFromComponent(PizzaPartyComponent, {
      duration: this.durationInSeconds * 1000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['custom-snackbar', `${type}-snackbar`],
    });
  }
}

@Component({
  selector: 'snack-bar-component-example-snack',
  template: `
    <span class="example-pizza-party">
  Pizza party!!! 🍕
</span>`,
  // The styleUrl property should be removed here
})
export class PizzaPartyComponent {}
