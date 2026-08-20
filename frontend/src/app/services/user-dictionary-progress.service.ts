import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/env';
import { UserDictionaryProgressData } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserDictionaryProgressService {
  private http = inject(HttpClient);

  getUserDictionaryProgress(params?: { userId?: string; dictionaryId?: string }) {
    return this.http.get<UserDictionaryProgressData[]>(
      `${environment.API_URL}/admin/user-dictionaries`,
      { params: params ?? {} }
    );
  }
}
