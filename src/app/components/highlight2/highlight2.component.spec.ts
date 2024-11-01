import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Highlight2Component } from './highlight2.component';

describe('Highlight2Component', () => {
  let component: Highlight2Component;
  let fixture: ComponentFixture<Highlight2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Highlight2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Highlight2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
