import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserData } from '../../../models';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIcon } from '@angular/material/icon';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-edit-user-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-user-modal.component.html',
  styleUrl: './edit-user-modal.component.scss'
})
export class EditUserModalComponent {
  private userService = inject(UserService);
  public data: UserData = inject(MAT_DIALOG_DATA);
  public userForm: FormGroup;

  constructor(private dialogRef: MatDialogRef<EditUserModalComponent>) {
    this.userForm = new FormGroup<any>({
      name: new FormControl(this.data.name, [Validators.required, Validators.min(4)]),
      login: new FormControl(this.data.login, [Validators.required, Validators.min(4)])
    });
  }

  saveData() {
    if (!this.data) {
      return;
    }

    const userToUpdate = {
      id: this.data.id,
      ...this.userForm.value
    };

    this.userService
      .updateUser(userToUpdate)
      .subscribe((updatedUserData: UserData) => {
        this.data.login = updatedUserData.login;
        this.data.name = updatedUserData.name;
        this.dialogRef.close();
      });
  }
}
