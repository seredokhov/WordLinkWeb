import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/env';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);

  constructor() { }

  login(body) {
    return this.http.post(`${environment.API_URL}/admin/login`, body);
  }
}
