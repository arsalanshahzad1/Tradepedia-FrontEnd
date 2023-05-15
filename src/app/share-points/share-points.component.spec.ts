import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharePointsComponent } from './share-points.component';

describe('SharePointsComponent', () => {
  let component: SharePointsComponent;
  let fixture: ComponentFixture<SharePointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharePointsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharePointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
