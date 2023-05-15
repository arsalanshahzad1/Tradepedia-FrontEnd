import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HscChapterListComponent } from './hsc-chapter-list.component';

describe('HscChapterListComponent', () => {
  let component: HscChapterListComponent;
  let fixture: ComponentFixture<HscChapterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HscChapterListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HscChapterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
