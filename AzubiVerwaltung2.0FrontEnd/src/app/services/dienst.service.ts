import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment';
import { Dienst } from '../models/dienst.model';

@Injectable({
  providedIn: 'root'
})
export class Dienstservice{
  private apiUrl = `${environment.apiUrl}/dienste`;
  constructor(private http: HttpClient) { }

  getallAufgaben(): Observable<Dienst[]> {
    return this.http.get<Dienst[]>(`${this.apiUrl}/getDienste`);
  }
  addDienst(newDienst:any):Observable<any>{
    return this.http.post(`${this.apiUrl}/addDienst`,newDienst);
  }
  deleteDienst(id: number): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/deleteDienst/${id}`, {});
}
}
