import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioPlayerComponent } from './audio-player.component';

describe('AudioPlayerComponent', () => {
  let component: AudioPlayerComponent;
  let fixture: ComponentFixture<AudioPlayerComponent>;
  let mockPlayPodcast;
  let mockPlayUserMusic;
  let mockPreloadPodcastOb;
  let mockAudioPlay;
  let mockStopAllSound;

  beforeEach(async () => {
    mockPlayPodcast = jasmine.createSpyObj(['subscribe','unsubscribe']);
    mockPlayUserMusic = jasmine.createSpyObj(['subscribe','unsubscribe']);
    mockPreloadPodcastOb = jasmine.createSpyObj(['subscribe','unsubscribe']);
    mockAudioPlay = jasmine.createSpyObj(['subscribe','unsubscribe']);
    mockStopAllSound = jasmine.createSpyObj(['subscribe','unsubscribe']);

    await TestBed.configureTestingModule({
      declarations: [AudioPlayerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AudioPlayerComponent);
    component = fixture.componentInstance;
    component.playPodcast = mockPlayPodcast;
    component.playUserMusic = mockPlayUserMusic;
    component.preloadPodcastOb = mockPreloadPodcastOb;
    component.audioPlay = mockAudioPlay;
    component.stopAllSound = mockStopAllSound;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
