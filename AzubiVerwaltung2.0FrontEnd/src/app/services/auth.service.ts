import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environment';
import { Router } from '@angular/router';

export interface AuthResponse {
  token: string;
  username: string;
  isAdmin: boolean;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: any, rememberMe: boolean = false) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          this.setSession(response, rememberMe);
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('username');
    localStorage.removeItem('is_admin');
    localStorage.removeItem('user_id');

    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('is_admin');
    sessionStorage.removeItem('user_id');
    this.router.navigate(['/login']);
  }

  private setSession(authResult: AuthResponse, rememberMe: boolean) {
    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem('auth_token', authResult.token);
    storage.setItem('username', authResult.username);
    storage.setItem('is_admin', authResult.isAdmin.toString());
    storage.setItem('user_id', authResult.userId.toString());
  }

  isAdmin(): boolean {
    const adminStatus = localStorage.getItem('is_admin') || sessionStorage.getItem('is_admin');
    return adminStatus === 'true';
  }
}
