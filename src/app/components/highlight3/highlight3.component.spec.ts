import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Highlight3Component } from './highlight3.component';

describe('Highlight3Component', () => {
  let component: Highlight3Component;
  let fixture: ComponentFixture<Highlight3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Highlight3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Highlight3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
