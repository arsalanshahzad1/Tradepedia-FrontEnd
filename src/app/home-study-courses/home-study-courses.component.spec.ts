import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeStudyCoursesComponent } from './home-study-courses.component';

describe('HomeStudyCoursesComponent', () => {
  let component: HomeStudyCoursesComponent;
  let fixture: ComponentFixture<HomeStudyCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeStudyCoursesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeStudyCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
