import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoChapterListComponent } from './video-chapter-list.component';

describe('VideoChapterListComponent', () => {
  let component: VideoChapterListComponent;
  let fixture: ComponentFixture<VideoChapterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoChapterListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoChapterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
