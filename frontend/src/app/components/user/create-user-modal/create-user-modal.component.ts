import { Component, inject } from '@angular/core';
import { first } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserData } from '../../../models';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIcon } from '@angular/material/icon';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-create-user-modal',
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
    ReactiveFormsModule,
    MatIcon
  ],
  templateUrl: './create-user-modal.component.html',
  styleUrl: './create-user-modal.component.scss'
})
export class CreateUserModalComponent {
  private userService = inject(UserService);
  public users = inject(MAT_DIALOG_DATA);
  public userForm: FormGroup
  public isPasswordHide: boolean = true;
  public isNewPasswordHide: boolean = true;

  constructor(private dialogRef: MatDialogRef<CreateUserModalComponent>) {
    this.userForm = new FormGroup<any>({
      name: new FormControl('', [Validators.required, Validators.minLength(4)]),
      login: new FormControl('', [Validators.required, Validators.minLength(4)]),
      password: new FormControl('', [Validators.required, Validators.minLength(5)]),
      passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(4)])
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const passwordConfirm = control.get('passwordConfirm');

    if (!password || !passwordConfirm) {
      return null;
    }

    return password.value === passwordConfirm.value ? null : { passwordMismatch: true };
  }

  saveData() {
    const { value } = this.userForm;

    const userToCreate = {
      login: value.login,
      name: value.name,
      password: value.password,
    }

    this.userService.createUser(userToCreate)
      .pipe(first())
      .subscribe((createdUser: UserData) => {
        const oldUsers = [...this.users.data];
        this.users.data = [createdUser, ...oldUsers];
        this.dialogRef.close();
      });
  }
}
