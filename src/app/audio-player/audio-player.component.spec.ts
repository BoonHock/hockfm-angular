import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioPlayerComponent } from './audio-player.component';
import { of } from 'rxjs';
import { PodcastStatus } from '../shared/enum/podcast-status';
import { By } from '@angular/platform-browser';

describe('AudioPlayerComponent', () => {
  let component: AudioPlayerComponent;
  let fixture: ComponentFixture<AudioPlayerComponent>;

  const PLAY_PODCAST = {
    podcastId: 1,
    title:
      'HITZ | Raj Wants To Reset Himself For His Break | HITZ Morning Crew',
    description: 'If you missed the HITZ Morning Crew, listen to them now!',
    url: 'https://megaphone-prod.s3.amazonaws.com/podcasts/64562f00-c83b-11ed-990e-b3403f0d3af8/episodes/77c1a79e-e4bb-11ed-91c1-2b5dd242c58a/stripped_e61d44ac8c2d7d7de19266035d31c238.mp3',
    date: '2023-04-27',
    status: PodcastStatus.none,
    playlist: {
      title: 'playlist title',
      channel: {
        name: 'channel name',
      },
    },
  };

  const PLAY_USER_MUSIC =
    'https://megaphone-prod.s3.amazonaws.com/podcasts/7cbc96ca-c88a-11ed-8c99-33052ed05da1/episodes/5e2f4872-e4c0-11ed-aa97-53531697a9b4/stripped_41a695913f31c027021fcfa604fa1cb6.mp3';
  const PRELOAD_PODCAST = {
    podcastId: 1,
    title:
      'HITZ | Ean Asking For Forgiveness To His Cousin | HITZ Morning Crew',
    description: 'If you missed the HITZ Morning Crew, listen to them now!',
    url: 'https://megaphone-prod.s3.amazonaws.com/podcasts/64562f00-c83b-11ed-990e-b3403f0d3af8/episodes/f9d96fb8-e4bc-11ed-b9b0-9f1123848c30/stripped_796c21ec80f85c66f24d727b8f80a3ee.mp3',
    date: '2023-04-27',
    status: PodcastStatus.none,
    playlist: {
      title: 'playlist title',
      channel: {
        name: 'channel name',
      },
    },
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [AudioPlayerComponent],
    });

    fixture = TestBed.createComponent(AudioPlayerComponent);
    component = fixture.componentInstance;

    component.playPodcast = of(PLAY_PODCAST);
    component.playUserMusic = of(PLAY_USER_MUSIC);
    component.preloadPodcastOb = of(PRELOAD_PODCAST);
    component.audioPlay = of();
    component.stopAllSound = of();

    // component.playPodcast.
    spyOn<AudioPlayerComponent, any>(component, 'playAudio').and.callFake(
      () => {}
    );
    spyOn<AudioPlayerComponent, any>(component, 'pauseAudio').and.callFake(
      () => {}
    );
    spyOn<AudioPlayerComponent, any>(
      component,
      'playUserMusicAudio'
    ).and.callFake(() => {});

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have one audio tag with play podcast url', () => {
    expect(
      fixture.debugElement.queryAll(
        By.css(`audio.audio_podcast[src="${PLAY_PODCAST.url}"]`)
      ).length
    ).toEqual(1);
  });

  it('should have one audio tag with preload podcast url', () => {
    expect(
      fixture.debugElement.queryAll(
        By.css(`audio.audio_podcast[src="${PRELOAD_PODCAST.url}"]`)
      ).length
    ).toEqual(1);
  });

  it('should have audio tag with user music url', () => {
    expect(
      fixture.debugElement.query(By.css(`#audio_user_music`))
    ).toBeTruthy();
  });

  describe('clicking audio buttons', () => {
    it('should call onPlayClicked when play button clicked', () => {
      spyOn(component, 'onPlayClicked');

      const playButton = fixture.debugElement.query(By.css(`#play_button`));
      playButton.triggerEventHandler('click', null);
      fixture.detectChanges();

      expect(component.onPlayClicked).toHaveBeenCalled();
    });

    it('should call onPauseClicked when pause button clicked', () => {
      spyOn(component, 'onPauseClicked');

      const pauseButton = fixture.debugElement.query(By.css(`#pause_button`));
      pauseButton.triggerEventHandler('click', null);
      fixture.detectChanges();

      expect(component.onPauseClicked).toHaveBeenCalled();
    });

    it('should call onNextClicked when next button clicked', () => {
      spyOn(component, 'onNextClicked');

      const nextButton = fixture.debugElement.query(By.css(`#next_button`));
      nextButton.triggerEventHandler('click', null);
      fixture.detectChanges();

      expect(component.onNextClicked).toHaveBeenCalled();
    });
  });

  // emit from parent component to check if audio tag is correct
  // describe('display audio tag', () => {
  //   it('should display user music audio tag', () => {
  //     // change audioElemToPlay
  //     // and see if has d-none class
  //   });

  //   it('should display audio1 audio tag', () => {
  //     // change audioElemToPlay
  //     // and see if has d-none class
  //   });

  //   it('should display audio2 audio tag', () => {
  //     // change audioElemToPlay
  //     // and see if has d-none class
  //   });
  // });
});
