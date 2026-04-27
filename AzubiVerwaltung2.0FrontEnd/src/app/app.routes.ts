import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { adminGuard } from './admin.guard';
import { authGuard } from './auth.guard';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  //Dashboard
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  //Profil
  {
    path: 'profil',
    loadComponent: () => import('./profil/profil.component').then(m => m.ProfilComponent),
    canActivate: [authGuard]
  },
  //Verwaltung
  {path: 'admin/verwaltung', loadComponent: () => import ('./azubis-verwalten/azubis-verwalten.component').then(m => m.AzubisVerwaltenComponent),
    canActivate: [authGuard,adminGuard]
  },
  {path: 'admin/diensteZuweisen', loadComponent: () => import ('./dienste-zuweisen/dienste-zuweisen.component').then(m => m.DienstplanComponent),
    canActivate: [authGuard,adminGuard]
  },
  {path: 'admin/analyse', loadComponent: () => import ('./analyse/analyse.component').then(m => m.AnalyseComponent),
    canActivate: [authGuard,adminGuard]
  },
  //wenn quatsch in URL
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  //wenn ungültige URL
  {path: '**', redirectTo: '/dashboard' }
];
