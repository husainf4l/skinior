import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizedDetailsComponent } from './authorized-details.component';

describe('AuthorizedDetailsComponent', () => {
  let component: AuthorizedDetailsComponent;
  let fixture: ComponentFixture<AuthorizedDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorizedDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorizedDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
