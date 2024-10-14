import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesShowcaseComponent } from './categories-showcase.component';

describe('CategoriesShowcaseComponent', () => {
  let component: CategoriesShowcaseComponent;
  let fixture: ComponentFixture<CategoriesShowcaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesShowcaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriesShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
