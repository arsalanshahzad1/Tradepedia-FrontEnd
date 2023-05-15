import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyTradingComponent } from './copy-trading.component';

describe('CopyTradingComponent', () => {
  let component: CopyTradingComponent;
  let fixture: ComponentFixture<CopyTradingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyTradingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyTradingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
