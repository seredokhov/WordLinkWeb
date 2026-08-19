import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/env';
import { DictionaryData } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  private http = inject(HttpClient);

  getDictionaries() {
    return this.http.get(`${environment.API_URL}/admin/dictionaries`);
  }

  createDictionary(body: Pick<DictionaryData, 'title'>) {
    return this.http.post(`${environment.API_URL}/admin/dictionary/create`, body);
  }

  updateDictionary(body: DictionaryData) {
    return this.http.patch(`${environment.API_URL}/admin/dictionary/update`, body);
  }

  deleteDictionary(id: string) {
    return this.http.delete(`${environment.API_URL}/admin/dictionary/delete/${id}`);
  }
}
