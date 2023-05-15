import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProfile2Component } from './create-profile2.component';

describe('CreateProfile2Component', () => {
  let component: CreateProfile2Component;
  let fixture: ComponentFixture<CreateProfile2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProfile2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProfile2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
