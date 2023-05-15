import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProfile3Component } from './create-profile3.component';

describe('CreateProfile3Component', () => {
  let component: CreateProfile3Component;
  let fixture: ComponentFixture<CreateProfile3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProfile3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProfile3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
