import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Azubi } from '../models/azubi.model';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class AzubiService {
  private apiUrl = `${environment.apiUrl}/azubi`;

  constructor(private http: HttpClient) { }

  // Holt alle Azubis vom Backend
  getAllAzubis(): Observable<Azubi[]> {
    return this.http.get<Azubi[]>(`${this.apiUrl}/getAzubis`);
  }
  addAzubi(newAzubi:any):Observable<any>{
    return this.http.post(`${this.apiUrl}/addAzubi`,newAzubi);
  }
  deleteAzubi(azubiId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/softDelete/${azubiId}`, {});
  }

}
