import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindProfileComponent } from './find-profile.component';

describe('FindProfileComponent', () => {
  let component: FindProfileComponent;
  let fixture: ComponentFixture<FindProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
