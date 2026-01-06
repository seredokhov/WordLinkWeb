import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/env';

@Injectable({
  providedIn: 'root'
})
export class WordService {
  private http = inject(HttpClient);

  constructor() { }

  getWords() {
    return this.http.get(`${environment.API_URL}/admin/words`);
  }

  deleteWord(id: string) {
    return this.http.delete(`${environment.API_URL}/admin/word/delete/${id}`);
  }
}
