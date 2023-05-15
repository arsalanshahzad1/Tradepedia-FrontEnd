import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalPlanComponent } from './signal-plan.component';

describe('SignalPlanComponent', () => {
  let component: SignalPlanComponent;
  let fixture: ComponentFixture<SignalPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignalPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignalPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
