import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ZuweisungService } from '../services/zuweisung.service';
import { AzubiService } from '../services/azubi.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  username: string | null = '';
  meineDienste: any[] = [];
  userId: number | null = null;
  passwordData = {
    newPassword: '',
    confirmPassword: ''
  };

  constructor(
    private authService: AuthService,
    private zuweisungService: ZuweisungService,
  ) {}

  ngOnInit() {
    this.username = localStorage.getItem('user_id') || sessionStorage.getItem('username');
    this.userId = Number(localStorage.getItem('user_id')|| sessionStorage.getItem('user_id'));
    this.loadMeineDienste();
    console.log(this.userId);
  }

loadMeineDienste() {
  const heute = new Date();
  heute.setHours(0, 0, 0, 0);

  this.zuweisungService.getPlan().subscribe({
    next: (alleZuweisungen) => {
      this.meineDienste = alleZuweisungen.filter((z: any) => {
        const azubiId = z.azubiId || z.AzubiId;
        const datumBackend = z.datum || z.Datum;

        if (!azubiId || !datumBackend) return false;

        const isIdOk = Number(azubiId) === Number(this.userId);

        const dDate = new Date(datumBackend);
        dDate.setHours(0, 0, 0, 0);
        const isHeute = dDate.getTime() === heute.getTime();

        return isIdOk && isHeute;
      });
    },
    error: (err) => {
      console.error(err);
    }
  });
}

  onChangePassword() {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      alert("Passwörter stimmen nicht überein!");
      return;
    }

    // Wir holen uns die ID (Die solltest du im AuthService mit speichern!)
    const userId = Number(localStorage.getItem('user_id'));

    this.authService.changePassword(userId, this.passwordData.newPassword).subscribe({
      next: () => {
        alert("Passwort wurde erfolgreich geändert!");
        this.passwordData = { newPassword: '', confirmPassword: '' };
      },
      error: (err) => alert("Fehler beim Ändern des Passworts")
    });
  }
}
