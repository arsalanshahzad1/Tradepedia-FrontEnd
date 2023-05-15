import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeminarListComponent } from './seminar-list.component';

describe('SeminarListComponent', () => {
  let component: SeminarListComponent;
  let fixture: ComponentFixture<SeminarListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeminarListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeminarListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
