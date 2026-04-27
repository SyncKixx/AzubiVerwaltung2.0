import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiensteZuweisenComponent } from './dienste-zuweisen.component';

describe('DiensteZuweisenComponent', () => {
  let component: DiensteZuweisenComponent;
  let fixture: ComponentFixture<DiensteZuweisenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiensteZuweisenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiensteZuweisenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
