import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcodentaComponent } from './ecodenta.component';

describe('EcodentaComponent', () => {
  let component: EcodentaComponent;
  let fixture: ComponentFixture<EcodentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcodentaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EcodentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
