import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandsShowcaseComponent } from './brands-showcase.component';

describe('BrandsShowcaseComponent', () => {
  let component: BrandsShowcaseComponent;
  let fixture: ComponentFixture<BrandsShowcaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandsShowcaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandsShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
