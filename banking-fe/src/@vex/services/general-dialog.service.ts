import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class GeneralDialogService {

  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  constructor(public dialog: MatDialog) { }

  confirmDialog(text: string, callback: Function, callbackCancel: Function = null) {
    this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = text;

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        callback();
      }

      if (callbackCancel && !result) {
        callbackCancel();
      }
      this.confirmDialogRef = null;
    });
  }

}
