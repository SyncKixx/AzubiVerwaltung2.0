import { Component, OnInit } from '@angular/core'; // <-- NEU: OnInit importieren
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit { // <-- NEU: implements OnInit
  loginData = {
    email: '',
    password: ''
  };
  safeCredentials: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  // NEU: Diese Methode feuert beim Aufrufen der Login-Seite
  ngOnInit() {
    // Wenn das Token im Speicher (egal welcher) gefunden wird, sofort zum Dashboard!
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onLogin() {
    this.authService.login(this.loginData, this.safeCredentials).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error("Login fehlgeschlagen", err);
      }
    });
  }
}
