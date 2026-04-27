import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { CommonModule,registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AzubiService } from '../services/azubi.service';
import { Dienstservice } from '../services/dienst.service';
import { ZuweisungService } from '../services/zuweisung.service';
import { forkJoin } from 'rxjs';
import localeDe from '@angular/common/locales/de';

registerLocaleData(localeDe);
@Component({
  selector: 'app-dienstplan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [{ provide: LOCALE_ID, useValue: 'de-DE' }],
  templateUrl: './dienste-zuweisen.component.html',
  styleUrls: ['./dienste-zuweisen.component.scss']
})
export class DienstplanComponent implements OnInit {
  azubis: any[] = [];
  dienste: any[] = [];
  zuweisungen: any[] = [];
  wochentage: Date[] = [];
  wochenOffset: number = 0;
  geaenderteZuweisungen: Map<string, any> = new Map(); // Key: dienstId-datum



  constructor(
    private azubiService: AzubiService,
    private dienstService: Dienstservice,
    private zuweisungService: ZuweisungService
  ) {}

  ngOnInit(): void {
    this.berechneAktuelleWoche();
    this.loadData();
  }

  loadData(): void {
  // forkjoin um dienste und auzbis erst zu laden
    forkJoin({
      azubis: this.azubiService.getAllAzubis(),
      dienste: this.dienstService.getallAufgaben()
    }).subscribe(({ azubis, dienste }) => {
      this.azubis = azubis;
      this.dienste = dienste;
      this.refreshZuweisungen();
  });
}

  refreshZuweisungen(): void {
    this.zuweisungService.getPlan().subscribe(data => {
      this.zuweisungen = data;
    });
  }

  berechneAktuelleWoche(): void {
  const heute = new Date();
  // Verschiebung um wochenOffset Wochen (7 Tage * Offset)
  heute.setDate(heute.getDate() + (this.wochenOffset * 7));

  const wochentag = heute.getDay();
  const montagDiff = wochentag === 0 ? -6 : 1 - wochentag;
  const montag = new Date(heute.setDate(heute.getDate() + montagDiff));

  this.wochentage = [];
  for (let i = 0; i < 5; i++) {
    const tag = new Date(montag);
    tag.setDate(montag.getDate() + i);
    this.wochentage.push(tag);
  }
}
  navigiereWoche(richtung: number): void {
  this.wochenOffset += richtung;
  this.geaenderteZuweisungen.clear(); // Lokale Änderungen bei Wochenwechsel verwerfen oder warnen
  this.berechneAktuelleWoche();
  this.refreshZuweisungen();
}



  // Hilfsmethode: Findet die passende Zuweisung im Array
  getZuweisung(dienstId: number, datum: Date): any {
  if (!this.zuweisungen) return null;

  const sucheDatum = datum.toISOString().split('T')[0];

  return this.zuweisungen.find(z => {
    const eintragDatum = z.datum.split('T')[0];
    return String(z.dienstId) === String(dienstId) && eintragDatum === sucheDatum;
  });
}

 onZuweisungChangeLocal(dienstId: number, datum: Date, event: any): void {
  const azubiId = event.target.value ? Number(event.target.value) : null;
  const datumStr = datum.toISOString().split('T')[0];
  const key = `${dienstId}-${datumStr}`;

  this.geaenderteZuweisungen.set(key, {
    dienstId: dienstId,
    azubiId: azubiId,
    datum: datumStr,
    istFeiertag: false
  });
}
  //Deutsche Days bekommen
getWochentagName(datum: Date): string {
  return datum.toLocaleDateString('de-DE', { weekday: 'long' });
}
//Muss man dienst überhaptz machen?
isTagInDienstPlan(dienstWochentage: string, datum: Date): boolean {
  if (!dienstWochentage) return false;
  const aktuellerTag = this.getWochentagName(datum); // z.B. "Dienstag"
  const erlaubteTage = dienstWochentage.split(',').map(t => t.trim());
  return erlaubteTage.includes(aktuellerTag);
}

speichereGanzeWoche(): void {
  const liste = Array.from(this.geaenderteZuweisungen.values());
  if (liste.length === 0) return;

  this.zuweisungService.saveZuweisung(liste).subscribe({
    next: () => {
      this.geaenderteZuweisungen.clear();
      this.refreshZuweisungen();
      alert('Alle Änderungen wurden erfolgreich gespeichert!');
    },
    error: (err) => console.error("Fehler beim Speichern:", err)
  });
}
}
