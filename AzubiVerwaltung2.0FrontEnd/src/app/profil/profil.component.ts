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

  passwordData = {
    newPassword: '',
    confirmPassword: ''
  };

  constructor(
    private authService: AuthService,
    private zuweisungService: ZuweisungService,
    private azubiService: AzubiService
  ) {}

  ngOnInit() {
    this.username = localStorage.getItem('username') || sessionStorage.getItem('username');
    this.loadMeineDienste();
  }

  loadMeineDienste() {
    // Hier laden wir den Plan und filtern im Frontend nach dem eigenen Namen/ID
    this.zuweisungService.getPlan().subscribe(alleZuweisungen => {
      // Wir filtern nur die Dienste für diese Woche, wo unser Name/ID steht
      this.meineDienste = alleZuweisungen.filter((z: any) =>
        z.azubiName === this.username // Oder nach ID filtern
      );
    });
  }

  onChangePassword() {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      alert("Passwörter stimmen nicht überein!");
      return;
    }

    // Wir holen uns die ID (Die solltest du im AuthService mit speichern!)
    const userId = Number(localStorage.getItem('user_id'));

    this.azubiService.changePassword(userId, this.passwordData.newPassword).subscribe({
      next: () => {
        alert("Passwort wurde erfolgreich geändert!");
        this.passwordData = { newPassword: '', confirmPassword: '' };
      },
      error: (err) => alert("Fehler beim Ändern des Passworts")
    });
  }
}
