import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service'; // Hier importiert der Guard den Service

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // Token da? Tür auf!
  } else {
    router.navigate(['/login']); // Kein Token? Ab zum Login!
    return false;
  }
};
