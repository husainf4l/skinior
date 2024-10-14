import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogTeaserComponent } from './blog-teaser.component';

describe('BlogTeaserComponent', () => {
  let component: BlogTeaserComponent;
  let fixture: ComponentFixture<BlogTeaserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogTeaserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogTeaserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
