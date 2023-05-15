import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquawkRoomPlanComponent } from './squawk-room-plan.component';

describe('SquawkRoomPlanComponent', () => {
  let component: SquawkRoomPlanComponent;
  let fixture: ComponentFixture<SquawkRoomPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SquawkRoomPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SquawkRoomPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
