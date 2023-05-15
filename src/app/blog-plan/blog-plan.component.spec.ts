import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogPlanComponent } from './blog-plan.component';

describe('BlogPlanComponent', () => {
  let component: BlogPlanComponent;
  let fixture: ComponentFixture<BlogPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
