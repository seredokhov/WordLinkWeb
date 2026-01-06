import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationPopupData } from '../../models';

@Component({
  selector: 'app-confirmation-popup',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogContent
  ],
  templateUrl: './confirmation-popup.component.html',
  styleUrl: './confirmation-popup.component.scss'
})
export class ConfirmationPopupComponent {
  public data: ConfirmationPopupData = inject(MAT_DIALOG_DATA);

  constructor(private dialogRef: MatDialogRef<ConfirmationPopupComponent>) {
  }

  confirm() {
    this.data.onConfirm();
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }
}
