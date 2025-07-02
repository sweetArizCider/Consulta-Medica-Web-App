import { Injectable  } from '@angular/core';
import { MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: "root"
})

export class Alert {
  constructor(private _snackBar: MatSnackBar) {}

  showSuccess(message: string,  action: string = 'Close'){
    this._snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  showError(message: string, action: string = 'Close') {
    this._snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
}
