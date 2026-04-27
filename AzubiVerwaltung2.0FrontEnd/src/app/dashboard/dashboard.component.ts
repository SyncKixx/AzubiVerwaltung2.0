import { Component, OnInit } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ZuweisungService } from '../services/zuweisung.service';
import { AzubiService } from '../services/azubi.service';
import { Dienstservice } from '../services/dienst.service';
import localeDe from '@angular/common/locales/de';
registerLocaleData(localeDe, 'de');

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class DashboardComponent implements OnInit {
  wochentage: Date[] = [];
  dienste: any[] = [];
  azubis: any[] = [];
  zuweisungen: any[] = [];

  constructor(
    private zuweisungService: ZuweisungService,
    private azubiService: AzubiService,
    private dienstService: Dienstservice
  ) {}

  ngOnInit(): void {
    this.berechneAktuelleWoche();
    this.loadData();
  }

  berechneAktuelleWoche(): void {
    const heute = new Date();
    const wochentag = heute.getDay();
    const montagDiff = wochentag === 0 ? -6 : 1 - wochentag;
    const montag = new Date(heute.setDate(heute.getDate() + montagDiff));

    for (let i = 0; i < 5; i++) {
      const tag = new Date(montag);
      tag.setDate(montag.getDate() + i);
      this.wochentage.push(tag);
    }
  }

loadData(): void {
  forkJoin({
    azubis: this.azubiService.getAllAzubis(),
    dienste: this.dienstService.getallAufgaben()
  }).subscribe(({ azubis, dienste }: any) => {
    this.azubis = azubis;
    this.dienste = dienste;

    console.log("Meine Dienste:", this.dienste);
    console.log("Meine azubis:", this.azubis);
    this.zuweisungService.getPlan().subscribe(z => {
      this.zuweisungen = z;
    });
    console.log("Meine Zuweisungen:", this.zuweisungen);
  });
}

  getZuweisungName(dienstId: number, tag: Date): string {
    if (!this.zuweisungen || !this.azubis) return '-- Frei --';

    const datumStr = tag.toISOString().split('T')[0];
    const zuweisung = this.zuweisungen.find(z =>
      String(z.dienstId) === String(dienstId) && z.datum.split('T')[0] === datumStr
    );

    if (zuweisung && zuweisung.azubiId) {
      // Sucht den passenden Azubi aus der Liste
      const azubi = this.azubis.find(a => String(a.userId) === String(zuweisung.azubiId));
      if (azubi) {
        return `${azubi.firstName} ${azubi.lastName}`;
      }
    }

    return '-- Frei --';
  }

  // Hilfsmethode, um zu prüfen, ob der Tag für den Dienst relevant ist
  isTagInDienstPlan(dienst: any, tag: Date): boolean {
  const wochentageDaten = dienst.wochentage || dienst.Wochentage;
  if (!wochentageDaten) return true;

  const tagIndex = tag.getDay(); // 1 = Montag ... 5 = Freitag
  const datenString = String(wochentageDaten);

  //Stimmt der Wochentag?
  const isRichtigerWochentag = datenString.includes(tagIndex.toString());
  if (!isRichtigerWochentag) return false;

  //Intervall-Check
  if (dienst.intervall === 1 || dienst.intervall === 2) {
    return true;
  }

  // intervall 3 = Monatlich -> Nur in der 1. Woche des Monats anzeigen!
  if (dienst.intervall === 3) {
    // Gibt true zurück, wenn das Datum zwischen dem 1. und 7. liegt
    return tag.getDate() <= 7;
  }

  return true; // Fallback
}
}
