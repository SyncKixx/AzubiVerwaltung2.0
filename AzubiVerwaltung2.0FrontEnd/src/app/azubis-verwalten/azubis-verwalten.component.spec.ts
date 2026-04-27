import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AzubisVerwaltenComponent } from './azubis-verwalten.component';

describe('AzubisVerwaltenComponent', () => {
  let component: AzubisVerwaltenComponent;
  let fixture: ComponentFixture<AzubisVerwaltenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AzubisVerwaltenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AzubisVerwaltenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
