import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WordValidations } from './models/WordValidations';

@Injectable({
  providedIn: 'root'
})
export class WordService {

  apiUrl = 'https://localhost:7289/words/';

  constructor(private http: HttpClient) { }

  getWord(): Observable<string> {
    return this.http.get<string>(this.apiUrl);
  }

  getValidations(word: string): Observable<WordValidations> {
    return this.http.get<WordValidations>(`${this.apiUrl}validations?word=${word}`)
  }

}
