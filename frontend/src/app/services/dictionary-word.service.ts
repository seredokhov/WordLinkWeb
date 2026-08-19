import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/env';
import { DictionaryWordData } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DictionaryWordService {
  private http = inject(HttpClient);

  getDictionaryWords(dictionaryId: string) {
    return this.http.get(`${environment.API_URL}/admin/dictionary/${dictionaryId}/words`);
  }

  createDictionaryWord(dictionaryId: string, body: Pick<DictionaryWordData, 'word' | 'translate'>) {
    return this.http.post(`${environment.API_URL}/admin/dictionary/${dictionaryId}/word/create`, body);
  }

  updateDictionaryWord(body: DictionaryWordData) {
    return this.http.patch(`${environment.API_URL}/admin/dictionary/word/update`, body);
  }

  deleteDictionaryWord(id: string) {
    return this.http.delete(`${environment.API_URL}/admin/dictionary/word/delete/${id}`);
  }
}
