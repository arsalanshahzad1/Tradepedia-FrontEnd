import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProfile1Component } from './create-profile1.component';

describe('CreateProfile1Component', () => {
  let component: CreateProfile1Component;
  let fixture: ComponentFixture<CreateProfile1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProfile1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProfile1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
