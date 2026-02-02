import { Component, inject } from '@angular/core';
import { first } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { LoginResponse } from '../../models';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  private router = inject(Router);
  private adminService = inject(AdminService);
  public hide: boolean = true;
  public login: string = '';
  public password: string = '';
  public error: string = '';

  submit() {
    const body = {
      login: this.login,
      password: this.password
    };

    this.adminService
      .login(body)
      .pipe(first())
      .subscribe({
        next: (response: LoginResponse) => {
          localStorage.setItem('token', response.token);
          this.router.navigateByUrl('/main');
        },
        error: error => {
          this.error = error.error.message;
        }
      });
  }
}
