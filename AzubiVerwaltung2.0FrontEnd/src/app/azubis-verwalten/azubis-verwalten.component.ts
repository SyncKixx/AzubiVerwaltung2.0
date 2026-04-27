import { Dienstservice } from './../services/dienst.service';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AzubiService } from '../services/azubi.service';
import { Dienst } from '../models/dienst.model';
import { Azubi } from '../models/azubi.model';

@Component({
  selector: 'app-azubis-verwalten',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './azubis-verwalten.component.html',
  styleUrls: ['./azubis-verwalten.component.scss']
})
export class AzubisVerwaltenComponent implements OnInit {
  private fb = inject(FormBuilder);
  private azubiService = inject(AzubiService);
  private dienstService = inject(Dienstservice);

  //wochentagliste
  wochentageListe: string[] = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];
  ausgewaehlteTage: string[] = [];

  //Azubi Shit
  azubis: any[] = [];
  selectedAzubi: any = null;
  isAddAzubiMode: boolean = false;

  //AufgabenShit
  dienste: any[] = [];
  selectedDienst: any = null;
  isAddDienstMode: boolean = false;

  //AzubisForm Shit
  azubiForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    passwordhash: ['', [Validators.required, Validators.minLength(6)]],
    adminRights: [false]
  });

  //Dienste Form Shit
  dienstForm: FormGroup = this.fb.group({
    bezeichnung: ['', Validators.required],
    beschreibung: ['', Validators.required],
    intervall: ['', Validators.required],
    wochentage: ['', Validators.required],
    icon: ['',Validators.required]
  });

  ngOnInit() {
    this.ladeAzubis();
    this.ladeDienste();
  }

  ladeAzubis() {
    this.azubiService.getAllAzubis().subscribe({
      next: (daten) => this.azubis = daten,
      error: (err) => console.error('Fehler beim Laden', err)
    });
  }


  selectAzubi(azubi: Azubi) {
    this.selectedAzubi = azubi;
    this.isAddAzubiMode = false;
    this.selectedDienst = null;
    this.isAddDienstMode = false;
  }


  openAddAzubiMode() {
    this.isAddAzubiMode = true;
    this.selectedAzubi = null;
    this.azubiForm.reset();
  }


  onSubmitAzubi() {
    if (this.azubiForm.valid) {
      this.azubiService.addAzubi(this.azubiForm.value).subscribe({
        next: () => {
          this.ladeAzubis();
          this.isAddAzubiMode = false;
        },
        error: (err) => console.error(err)
      });
    }
  }
  onSubmitDienst() {
    if (this.dienstForm.valid) {
        this.dienstService.addDienst(this.dienstForm.value).subscribe({
        next: () => {
          this.ladeDienste();
          this.isAddDienstMode = false;
          this.dienstForm.reset();
        },
        error: (err) => console.error(err)
      });
    }
  }
  ladeDienste() {
    this.dienstService.getallAufgaben().subscribe({
      next: (daten) => this.dienste = daten,
      error: (err) => console.error('Fehler beim Laden', err)
    });
  }
  selectDienst(dienst: Dienst) {
    this.selectedDienst = dienst;
    this.isAddDienstMode = false;
    this.selectedAzubi = null;
    this.isAddAzubiMode = false;
  }

  openAddDienstMode() {
    this.isAddDienstMode = true;
    this.ausgewaehlteTage = [];
    this.selectedDienst = null;
    this.selectedAzubi = null;
    this.isAddAzubiMode = false;
  }
  onTagToggle(tag: string, event: any) {
  if (event.target.checked) {
    this.ausgewaehlteTage.push(tag);
  } else {
    this.ausgewaehlteTage = this.ausgewaehlteTage.filter(t => t !== tag);
  }


  this.dienstForm.patchValue({
    wochentage: this.ausgewaehlteTage.join(',')
  });
}
loescheAzubi(id: number): void {
  if (confirm('Möchtest du diesen Azubi wirklich entfernen?')) {
    this.azubiService.deleteAzubi(id).subscribe({
      next: () => {
        this.azubis = this.azubis.filter(a => a.userId !== id);
        this.selectedAzubi = null;
      },
      error: (err) => console.error("Fehler beim Löschen des Azubis:", err)
    });
  }
}

loescheDienst(id: number): void {
  if (confirm('Möchtest du diesen Dienst wirklich entfernen?')) {
    this.dienstService.deleteDienst(id).subscribe({
      next: () => {
        this.dienste = this.dienste.filter(d => d.id !== id);
        this.selectedDienst = null;
      },
      error: (err) => console.error("Fehler beim Löschen des Dienstes:", err)
    });
  }
}
}
