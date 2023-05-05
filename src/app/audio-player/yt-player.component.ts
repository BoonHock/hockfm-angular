import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';

declare global {
  interface Window {
    // trustedTypes: any,
    // onYTReady: any,
    YT: any;
  }
}

@Component({
  selector: 'hfm-yt-player',
  templateUrl: './yt-player.component.html',
  styleUrls: ['./yt-player.component.scss'],
})
export class YtPlayerComponent implements OnInit, OnDestroy {
  @Input() ytPlayBtnClicked!: Observable<string>;
  @Input() ytPlayVid!: Observable<void>;
  @Input() ytNextVid!: Observable<void>;

  @Input() stopAllSound!: Observable<void>;

  @Output() isYtPlayerCreatedEmit = new EventEmitter<boolean>();
  @Output() ytEndedEmit = new EventEmitter<void>();

  // @ViewChild('loadScripts') loadScripts: ElementRef;
  private ytEventSub!: Subscription;
  private ytPlaySub!: Subscription;
  private ytNextSub!: Subscription;
  private stopAllSoundSub!: Subscription;

  private videoId = '';
  private playlistId = '';
  private player: any;
  private ytPlaylistIndex = 0;

  constructor() {}

  ngOnInit(): void {
    let yt_script = document.createElement('script');
    yt_script.src = 'https://www.youtube.com/iframe_api';
    let first_script_tag = document.getElementsByTagName('script')[0];
    first_script_tag.parentNode?.insertBefore(yt_script, first_script_tag);

    this.ytEventSub = this.ytPlayBtnClicked.subscribe((ytUrl) => {
      if (this.player) {
        this.player.destroy();
      }

      const url = new URL(ytUrl);
      this.videoId = url.searchParams.get('v') ?? '';
      this.playlistId = url.searchParams.get('list') ?? '';

      this.startVideo();
    });

    this.ytPlaySub = this.ytPlayVid.subscribe(() => this.player?.playVideo());

    this.ytNextSub = this.ytNextVid.subscribe(() => this.player?.nextVideo());

    this.stopAllSoundSub = this.stopAllSound.subscribe(() =>
      this.player?.pauseVideo()
    );
  }

  ngOnDestroy(): void {
    this.ytEventSub.unsubscribe();
    this.ytPlaySub.unsubscribe();
    this.stopAllSoundSub.unsubscribe();
    this.ytNextSub.unsubscribe();
  }

  private startVideo(): void {
    this.player = new window['YT'].Player('player', {
      height: '390',
      // width: '640',
      // height: '100%',
      width: '100%',
      videoId: this.videoId,
      playerVars: {
        // 'playsinline': 1
        listType: 'playlist',
        list: this.playlistId,
      },
      events: {
        onReady: this.onPlayerReady,
        onStateChange: (event: any) => {
          // must wrap in arrow function otherwise 'this' in onPlayerStateChange
          // will mean different thing
          this.onPlayerStateChange(event);
        },
      },
    });

    this.isYtPlayerCreatedEmit.emit(this.player !== undefined);
  }

  // // autoplay video
  private onPlayerReady(event: any) {
    event.target.playVideo();
  }

  // when video ends
  private onPlayerStateChange(event: any) {
    if (
      event.data === window['YT'].PlayerState.BUFFERING &&
      this.player?.getPlaylistIndex() != this.ytPlaylistIndex
    ) {
      this.ytPlaylistIndex = this.player?.getPlaylistIndex();
      this.player?.pauseVideo();
      this.ytEndedEmit.emit();
    }
  }
}
