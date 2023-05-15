import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedProfileComponent } from './recommended-profile.component';

describe('RecommendedProfileComponent', () => {
  let component: RecommendedProfileComponent;
  let fixture: ComponentFixture<RecommendedProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommendedProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendedProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
