import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/env';
import { UserData } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);

  constructor() {  }

  getUsers() {
    return this.http.get(`${environment.API_URL}/admin/users`);
  }

  updateUser(body: UserData) {
    return this.http.patch(`${environment.API_URL}/admin/user/update`, body);
  }

  createUser(body: UserData) {
    return this.http.post(`${environment.API_URL}/admin/user/create`, body);
  }

  deleteUser(id: string) {
    return this.http.delete(`${environment.API_URL}/admin/user/delete/${id}`);
  }
}
