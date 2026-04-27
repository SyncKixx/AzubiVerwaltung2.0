import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Zuweisung } from '../models/zuweisung.model'; // Pfad ggf. anpassen!

@Injectable({
  providedIn: 'root'
})
export class ZuweisungService {
  // WICHTIG: Ersetze 7253 durch den Port, der dir vorhin im Browser angezeigt wurde!
  private apiUrl = 'https://localhost:7253/api/Zuweisung';

  constructor(private http: HttpClient) { }


  getPlan(): Observable<Zuweisung[]> {
    return this.http.get<Zuweisung[]>(`${this.apiUrl}/getPlan`);
  }

  // Im ZuweisungService
saveZuweisung(zuweisungen: any[]): Observable<any> {
  // Wir senden das gesamte Array an einen neuen Endpunkt
  return this.http.post(`${this.apiUrl}/saveZuweisung`, zuweisungen);
}
}
