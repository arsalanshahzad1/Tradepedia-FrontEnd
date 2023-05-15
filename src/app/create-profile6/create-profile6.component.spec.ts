import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProfile6Component } from './create-profile6.component';

describe('CreateProfile6Component', () => {
  let component: CreateProfile6Component;
  let fixture: ComponentFixture<CreateProfile6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProfile6Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProfile6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
