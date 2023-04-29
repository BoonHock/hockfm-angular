import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { IPodcast } from '../podcasts/podcast';

@Component({
  selector: 'hfm-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent implements OnDestroy, OnInit {
  @Input() playPodcast!: Observable<IPodcast>;
  @Input() playUserMusic!: Observable<string>;
  @Input() preloadPodcastOb!: Observable<IPodcast>;
  @Input() audioPlay!: Observable<void>;
  @Input() stopAllSound!: Observable<void>;

  @Output() pauseClickedEmit = new EventEmitter<void>();
  @Output() playClickedEmit = new EventEmitter<void>();
  @Output() nextClickedEmit = new EventEmitter<void>();
  @Output() audioEndedEmit = new EventEmitter<string>();

  private playPodcastSub!: Subscription;
  private playUserMusicSub!: Subscription;
  private preloadPodcastSub!: Subscription;
  private audioPlaySub!: Subscription;
  private stopAllSoundSub!: Subscription;

  private audioUserMusicElem!: HTMLAudioElement;
  private audioElem1!: HTMLAudioElement;
  private audioElem2!: HTMLAudioElement;

  audioElemToPlay!: HTMLAudioElement;

  constructor() {}

  ngOnInit(): void {
    this.audioUserMusicElem = document.getElementById(
      'audio_user_music'
    ) as HTMLAudioElement;
    this.audioElem1 = document.getElementById('audio_1') as HTMLAudioElement;
    this.audioElem2 = document.getElementById('audio_2') as HTMLAudioElement;

    this.audioElemToPlay = this.audioUserMusicElem; // init

    this.playPodcastSub = this.playPodcast.subscribe((podcast) => {
      const preloadedAudioElem = document.querySelectorAll(
        `audio.audio_podcast[src="${podcast.url}"]`
      );

      if (preloadedAudioElem.length > 0) {
        this.audioElemToPlay = preloadedAudioElem[0] as HTMLAudioElement;
      } else {
        this.audioElemToPlay = this.audioElem1;
        this.audioElemToPlay.src = podcast.url;
        this.pauseAudio();
      }

      // this.preloadPodcast(next); // preload next podcast
      this.playAudio();
    });

    this.audioPlaySub = this.audioPlay.subscribe(() => this.playAudio());

    this.preloadPodcastSub = this.preloadPodcastOb.subscribe((podcast) =>
      this.preloadPodcast(podcast)
    );

    this.stopAllSoundSub = this.stopAllSound.subscribe(() => {
      this.audioUserMusicElem.pause();
      this.audioElem1.pause();
      this.audioElem2.pause();
    });

    this.playUserMusicSub = this.playUserMusic.subscribe((url) => {
      this.audioElemToPlay = this.audioUserMusicElem;
      this.audioUserMusicElem.src = url;
      this.playUserMusicAudio();
    });
  }

  ngOnDestroy(): void {
    this.playPodcastSub.unsubscribe();
    this.playUserMusicSub.unsubscribe();
    this.preloadPodcastSub.unsubscribe();
    this.audioPlaySub.unsubscribe();
    this.stopAllSoundSub.unsubscribe();
  }

  onPauseClicked(): void {
    this.pauseClickedEmit.emit();
  }

  onPlayClicked(): void {
    this.playClickedEmit.emit();
  }

  onNextClicked(): void {
    this.nextClickedEmit.emit();
  }

  onAudioEnded(): void {
    this.audioEndedEmit.emit();
  }

  playAudio(): void {
    this.audioElemToPlay.play();
  }

  pauseAudio(): void {
    this.audioElemToPlay.pause();
  }

  playUserMusicAudio(): void {
    this.audioUserMusicElem.play();
  }

  preloadPodcast(podcast: IPodcast): void {
    if (![this.audioElem1.src, this.audioElem2.src].includes(podcast.url)) {
      let audioToPreload =
        this.audioElemToPlay === this.audioElem1
          ? this.audioElem2
          : this.audioElem1;

      audioToPreload.src = podcast.url;
    }
  }
}
