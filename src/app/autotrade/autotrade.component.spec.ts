import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutotradeComponent } from './autotrade.component';

describe('AutotradeComponent', () => {
  let component: AutotradeComponent;
  let fixture: ComponentFixture<AutotradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutotradeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutotradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
