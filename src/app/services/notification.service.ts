import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(public _snackBar: MatSnackBar) { }
  
  config: MatSnackBarConfig = {
    duration:3000,
    horizontalPosition: 'right',
    verticalPosition: 'bottom'
  }

  config2: MatSnackBarConfig = {
    duration:8000,
    horizontalPosition: 'right',
    verticalPosition: 'bottom'
  }

  long_config: MatSnackBarConfig = {
    duration:0,
    horizontalPosition: 'center',
    verticalPosition: 'top'
  }

  longSuccessMsg(msg: string){
    this.long_config['panelClass'] = ['notification','success'];
    this._snackBar.open(msg,'',this.long_config);
  }

  success(msg: string){
    this.config['panelClass'] = ['notification','success'];
    this._snackBar.open(msg,'',this.config);
  }

  warning(msg: string){
    this.config['panelClass'] = ['notification','warn'];
    this._snackBar.open(msg,'',this.config);
  }

  longMsg(msg: string){
    this.config['panelClass'] = ['notification','success'];
    this._snackBar.open(msg,'',this.config2);
  }

}
