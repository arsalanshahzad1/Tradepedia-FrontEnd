import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalDetailComponent } from './signal-detail.component';

describe('SignalDetailComponent', () => {
  let component: SignalDetailComponent;
  let fixture: ComponentFixture<SignalDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignalDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
