import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyseService } from '../services/analyse.service';

@Component({
  selector: 'app-analyse',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analyse.component.html',
  styleUrls: ['./analyse.component.scss']
})
export class AnalyseComponent implements OnInit {
  statistikDaten: any[] = [];
  maxDienste: number = 0;

  constructor(private analyseService: AnalyseService) {}

  ngOnInit(): void {
    this.analyseService.getStatistik().subscribe({
      next: (data) => {
        this.statistikDaten = data;
        if (data.length > 0) {
          this.maxDienste = Math.max(...data.map(d => d.anzahlDienste));
        }
      },
      error: (err) => console.error("Fehler beim Laden der Statistik", err)
    });
  }
}
