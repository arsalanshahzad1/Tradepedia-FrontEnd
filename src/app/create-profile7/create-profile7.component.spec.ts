import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProfile7Component } from './create-profile7.component';

describe('CreateProfile7Component', () => {
  let component: CreateProfile7Component;
  let fixture: ComponentFixture<CreateProfile7Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProfile7Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProfile7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
