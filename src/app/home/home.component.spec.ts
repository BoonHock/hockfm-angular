import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { PodcastsService } from '../podcasts/podcast.service';
import {
  ChangeDetectorRef,
  ElementRef,
  DebugElement,
  Directive,
  Input,
  HostListener,
} from '@angular/core';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { MaterialModule } from '../shared/material/material.module';
import { FormsModule } from '@angular/forms';
import { YtPlayerComponent } from '../audio-player/yt-player.component';
import { AudioPlayerComponent } from '../audio-player/audio-player.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PodcastStatus } from '../shared/enum/podcast-status';
import { ConvertDbDatePipe } from '../shared/pipes/convert-db-date.pipe';
import { By } from '@angular/platform-browser';

@Directive({
  selector: '[routerLink]',
  // host: { '(click)': 'onClick()' }, // this works too besides @HostListener
})
export class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  @HostListener('click')
  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let audioPlayerDE: DebugElement;
  let audioPlayerComponent: AudioPlayerComponent;
  let audioUserMusicElem: any;
  let audio1Elem: any;
  let audio2Elem: any;
  let fixture: ComponentFixture<HomeComponent>;
  let mockPodcastService;
  let mockElementRef;
  let mockScrollDispatcher;
  let mockCdRef;
  let mockSnackbar;
  const PLAY_USER_MUSIC =
    'https://megaphone-prod.s3.amazonaws.com/podcasts/7cbc96ca-c88a-11ed-8c99-33052ed05da1/episodes/5e2f4872-e4c0-11ed-aa97-53531697a9b4/stripped_41a695913f31c027021fcfa604fa1cb6.mp3';
  const PODCASTS = [
    {
      id: '1',
      title: 'title 1',
      description: 'description 1',
      url: 'https://megaphone-prod.s3.amazonaws.com/podcasts/7cbc96ca-c88a-11ed-8c99-33052ed05da1/episodes/5e2f4872-e4c0-11ed-aa97-53531697a9b4/stripped_41a695913f31c027021fcfa604fa1cb6.mp3',
      date: '2022-01-01',
      status: PodcastStatus.none,
      playlist: {
        title: 'playlist title',
        channel: {
          name: 'channel name',
        },
      },
    },
    {
      id: '2',
      title: 'title 2',
      description: 'description 2',
      url: 'https://megaphone-prod.s3.amazonaws.com/podcasts/64562f00-c83b-11ed-990e-b3403f0d3af8/episodes/f9d96fb8-e4bc-11ed-b9b0-9f1123848c30/stripped_796c21ec80f85c66f24d727b8f80a3ee.mp3',
      date: '2022-01-01',
      status: PodcastStatus.none,
      playlist: {
        title: 'playlist title',
        channel: {
          name: 'channel name',
        },
      },
    },
  ];

  beforeEach(async () => {
    mockPodcastService = jasmine.createSpyObj(['updatePodcastStatus', 'getPodcastsToListen']);
    mockElementRef = jasmine.createSpyObj(['nativeElement']);
    mockScrollDispatcher = jasmine.createSpyObj(['scrolled']);
    mockCdRef = jasmine.createSpyObj(['detectChanges']);
    mockSnackbar = jasmine.createSpyObj(['open']);

    await TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        YtPlayerComponent,
        AudioPlayerComponent,
        ConvertDbDatePipe,
        RouterLinkDirectiveStub,
      ],
      imports: [BrowserAnimationsModule, MaterialModule, FormsModule],
      providers: [
        { provide: PodcastsService, useValue: mockPodcastService },
        { provide: ElementRef, useValue: mockElementRef },
        { provide: ScrollDispatcher, useValue: mockScrollDispatcher },
        { provide: ChangeDetectorRef, useValue: mockCdRef },
        { provide: MatSnackBar, useValue: mockSnackbar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    mockPodcastService.getPodcastsToListen.and.returnValue(of(PODCASTS));

    // ignore this function
    spyOn(component, 'detectInfiniteScroll');

    audioPlayerDE = fixture.debugElement.query(By.directive(AudioPlayerComponent));

    audioPlayerComponent = audioPlayerDE.componentInstance;
    audioUserMusicElem = audioPlayerDE.query(By.css('#audio_user_music')).nativeElement;
    audio1Elem = audioPlayerDE.query(By.css('#audio_1')).nativeElement;
    audio2Elem = audioPlayerDE.query(By.css('#audio_2')).nativeElement;

    spyOn(audioPlayerComponent, 'playAudio');
    spyOn(audioPlayerComponent, 'pauseAudio');
    spyOn(audioPlayerComponent, 'playUserMusicAudio');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('podcast row', () => {
    it('should have 2 rows', () => {
      const podcastTr = fixture.debugElement.queryAll(By.css('#podcast_table tbody > tr'));

      expect(podcastTr.length).toEqual(2);
    });

    it('should display channel name', () => {
      const podcastTr = fixture.debugElement.queryAll(By.css('#podcast_table tbody > tr'));

      expect(podcastTr[0].queryAll(By.css('td'))[0].nativeElement.textContent).toContain(
        PODCASTS[0].playlist.channel.name,
      );
    });

    it('should have the right routerLink url', () => {
      const podcastTr = fixture.debugElement.queryAll(By.css('#podcast_table tbody > tr'));

      const routerLink = podcastTr[0]
        .query(By.directive(RouterLinkDirectiveStub))
        .injector.get(RouterLinkDirectiveStub);

      podcastTr[0].query(By.css('a')).triggerEventHandler('click', null);
      expect(routerLink.navigatedTo).toEqual(['/podcasts', PODCASTS[0].id]);
    });

    it('should call onRowPlayBtnClicked with correct podcastIndex', () => {
      spyOn(component, 'onRowPlayBtnClicked');

      const playBtn = fixture.debugElement.queryAll(
        By.css('#podcast_table tbody > tr span[title="play"]'),
      );

      for (let i = 0; i < playBtn.length; i++) {
        playBtn[i].triggerEventHandler('click', null);
        expect(component.onRowPlayBtnClicked).toHaveBeenCalledWith(i);
      }
    });

    // skip checks for other stuffs because I am lazy
  });

  describe('audio player component', () => {
    it('should display user audio tag only', () => {
      component.audioPlayUserMusicEmit.emit(PLAY_USER_MUSIC);

      expect(audioPlayerComponent.audioElemToPlay).toEqual(audioUserMusicElem);
      expect(audioUserMusicElem).not.toHaveClass('d-none');
      expect(audio1Elem).toHaveClass('d-none');
      expect(audio2Elem).toHaveClass('d-none');
    });

    it('should call playUserMusicAudio', () => {
      component.audioPlayUserMusicEmit.emit(PLAY_USER_MUSIC);

      expect(audioPlayerComponent.playUserMusicAudio).toHaveBeenCalled();
    });

    it('should display audio1 audio tag', () => {
      component.audioPlayPodcastEmit.emit(PODCASTS[0]);

      fixture.detectChanges();

      expect(audioPlayerComponent.audioElemToPlay).toEqual(audio1Elem);
      expect(audioUserMusicElem).toHaveClass('d-none');
      expect(audio1Elem).not.toHaveClass('d-none');
      expect(audio2Elem).toHaveClass('d-none');
    });

    it('should preload podcast on audio1', () => {
      component.preloadPodcastEmit.emit(PODCASTS[0]);

      expect(audio1Elem.src).toEqual(PODCASTS[0].url);
    });

    it('should preload podcast on audio2', () => {
      component.audioPlayPodcastEmit.emit(PODCASTS[0]);
      component.preloadPodcastEmit.emit(PODCASTS[1]);

      expect(audio2Elem.src).toEqual(PODCASTS[1].url);
    });

    it('should display audio2 audio tag', () => {
      // play podcast0 and preload podcast1
      // then play podcast1. should then display audi2
      component.audioPlayPodcastEmit.emit(PODCASTS[0]);
      component.preloadPodcastEmit.emit(PODCASTS[1]);
      component.audioPlayPodcastEmit.emit(PODCASTS[1]);

      fixture.detectChanges();

      expect(audioPlayerComponent.audioElemToPlay).toEqual(audio2Elem);
      expect(audioUserMusicElem).toHaveClass('d-none');
      expect(audio1Elem).toHaveClass('d-none');
      expect(audio2Elem).not.toHaveClass('d-none');
    });

    it('should call playAudio', () => {
      component.audioPlayEmit.emit();

      expect(audioPlayerComponent.playAudio).toHaveBeenCalled();
    });

    it('should call pauseAudio', () => {
      spyOn(component, 'onPauseClicked');
      // audioPlayerComponent.pauseClickedEmit.emit();
      // another way to emit event
      audioPlayerDE.triggerEventHandler('pauseClickedEmit', null);

      expect(component.onPauseClicked).toHaveBeenCalled();
    });
  });
});
