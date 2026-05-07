import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes'; // <-- Dein Routen-Pfad

// 1. NEU: Den HttpClient und das Interceptor-Werkzeug importieren
import { provideHttpClient, withInterceptors } from '@angular/common/http';

// 2. WICHTIG: Deinen eigenen Interceptor importieren (Pfad bitte anpassen!)
// import { authInterceptor } from './interceptors/auth.interceptor';

import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';

registerLocaleData(localeDe);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // Deine URLs

    // 3. HIER IST DIE LÖSUNG: Wir geben Angular das HTTP-Werkzeug
    // UND hängen gleich deinen Token-Türsteher mit dran!
    // Falls du den Interceptor noch nicht hast, reicht auch nur: provideHttpClient()
    provideHttpClient(), // <-- oder eben provideHttpClient(withInterceptors([authInterceptor]))

    { provide: LOCALE_ID, useValue: 'de-DE' }
  ]
};
