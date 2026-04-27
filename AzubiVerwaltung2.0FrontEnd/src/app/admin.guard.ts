import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Wir prüfen zwei Dinge: Ist er eingeloggt UND ist er Admin?
  if (authService.isLoggedIn() && authService.isAdmin()) {
    return true; // Tür auf für Admins!
  } else {
    // Normale Azubis (oder Ausgeloggte) schicken wir einfach aufs Dashboard zurück
    router.navigate(['/dashboard']);
    return false;
  }
};
