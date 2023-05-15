import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquawkRoomComponent } from './squawk-room.component';

describe('SquawkRoomComponent', () => {
  let component: SquawkRoomComponent;
  let fixture: ComponentFixture<SquawkRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SquawkRoomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SquawkRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
