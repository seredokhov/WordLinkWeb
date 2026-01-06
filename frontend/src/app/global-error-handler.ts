import { ErrorHandler, inject, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private router = inject(Router);
  private zone = inject(NgZone);

  handleError(error: any): void {
    if (error.status === 403) {
      localStorage.removeItem('token');
      this.zone.run(() => {
        this.router.navigateByUrl('/login');
      });
    }
  }
}
