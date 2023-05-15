import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProfile5Component } from './create-profile5.component';

describe('CreateProfile5Component', () => {
  let component: CreateProfile5Component;
  let fixture: ComponentFixture<CreateProfile5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProfile5Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProfile5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
