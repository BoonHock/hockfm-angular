import { ScrollDispatcher } from '@angular/cdk/scrolling';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { IPodcast } from '../podcasts/podcast';
import { PodcastsService } from '../podcasts/podcast.service';
import { PlayType } from '../shared/enum/play-type';
import { PodcastStatus } from '../shared/enum/podcast-status';

@Component({
  selector: 'hfm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  ytPlayEmit = new EventEmitter<string>();
  ytPlayVidEmit = new EventEmitter<void>();
  ytNextVidEmit = new EventEmitter<void>();

  audioPlayPodcastEmit = new EventEmitter<IPodcast>();
  audioPlayEmit = new EventEmitter<void>();
  preloadPodcastEmit = new EventEmitter<IPodcast>();
  audioPlayUserMusicEmit = new EventEmitter<string>();

  stopAllSoundEmit = new EventEmitter<void>();

  podcasts: IPodcast[] = [];

  init_yt_player = false;
  ytUrl = 'https://www.youtube.com/watch?v=k8A3aQhOfqc&list=RDk8A3aQhOfqc&start_radio=1';
  currentPodcastIndex = -1;
  isYt_MatTabActive = false;
  currentPlaying: PlayType = PlayType.none;
  isLoadingPodcast = false;

  podcastStatus: typeof PodcastStatus = PodcastStatus;
  playType: typeof PlayType = PlayType;
  uploadedSongs?: FileList;

  private sub!: Subscription;
  private subLoadMore!: Subscription;
  private postSkipSub!: Subscription;
  private postResetSub!: Subscription;
  private postListenedSub!: Subscription;

  private readonly alternativeCounter = 1; // 1 means every 1 to 2 songs play podcast. 0-index
  private musicCounter = 0;
  private continueYt = false;
  private isYtPlayerCreated = false;
  private noMorePodcast = false;

  private readonly retryMilisInterval = 30000;

  constructor(
    private podcastService: PodcastsService,
    private el: ElementRef,
    private scrollDispatcher: ScrollDispatcher,
    private cdRef: ChangeDetectorRef,
    private snackBar: MatSnackBar,
  ) {}

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.code) {
      case 'KeyP':
        if (this.currentPlaying === PlayType.none) {
          if (this.isYt_MatTabActive) {
            this.onYtStartBtnClick();
          } else {
            this.onFileStartBtnClick();
          }
        } else {
          this.onPlayBtnClicked();
        }
        break;
      case 'KeyN':
        if (this.currentPlaying === PlayType.none) {
          if (this.isYt_MatTabActive) {
            this.onYtStartBtnClick();
          } else {
            this.onFileStartBtnClick();
          }
        } else {
          this.onNextClicked();
        }
        break;
      case 'KeyO':
        this.onPauseClicked();
        break;
    }
  }

  /**
   * have to manually detect infinite scroll. dunno why
   * https://stackoverflow.com/questions/36919399/angular-2-view-not-updating-after-model-changes
   */
  detectInfiniteScroll(): void {
    const tmp = this.scrollDispatcher.getAncestorScrollContainers(this.el);

    if (tmp.length === 0) {
      return;
    }
    const matDrawer = tmp[0];

    this.scrollDispatcher.scrolled().subscribe({
      next: () => {
        const podcastPosition = matDrawer.measureScrollOffset('bottom');
        if (podcastPosition <= 100 && !this.isLoadingPodcast) {
          this.loadMorePodcast();
        }
      },
    });
  }

  ngOnInit(): void {
    this.isLoadingPodcast = true;
    this.loadMorePodcast();
    this.detectInfiniteScroll();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    if (this.subLoadMore) {
      this.subLoadMore.unsubscribe();
    }
    if (this.postSkipSub) {
      this.postSkipSub.unsubscribe();
    }
    if (this.postResetSub) {
      this.postResetSub.unsubscribe();
    }
    if (this.postListenedSub) {
      this.postListenedSub.unsubscribe();
    }
  }

  onFileStartBtnClick(): void {
    this.playNext();
  }

  onYtStartBtnClick(): void {
    this.continueYt = true;
    this.buildYtPlayer();
  }

  onPlayBtnClicked(): void {
    if (this.currentPlaying === PlayType.podcast || this.currentPlaying === PlayType.user_music) {
      this.audioPlayEmit.emit();
    } else if (this.currentPlaying === PlayType.youtube) {
      this.ytPlayVidEmit.emit();
    }
  }

  onPauseClicked(): void {
    this.stopAllSounds();
  }

  onNextClicked(): void {
    if (this.currentPlaying === PlayType.podcast) {
      this.setSkipPodcast(this.currentPodcastIndex);
    }
    this.continueYt = false;

    if (this.isYt_MatTabActive && !this.isYtPlayerCreated) {
      this.buildYtPlayer();
    } else {
      this.playNext();
    }
  }

  private setSkipPodcast(skipPodcastIndex: number, retries?: number): void {
    const currentTryCount = retries ? retries + 1 : 1;

    this.postSkipSub = this.podcastService
      .updatePodcastStatus(this.podcasts[skipPodcastIndex].podcastId, PodcastStatus.skipped)
      .subscribe({
        next: (result) => {
          if (result === 'OK') {
            this.podcasts[skipPodcastIndex].status = PodcastStatus.skipped;
          }
        },
        error: (err) => {
          if (currentTryCount > 10) {
            console.log(`Failed to set skip for podcast: ${err}. Max retries reached.`);
          } else {
            console.log(`Failed to set skip for podcast: ${err}. Will retry again now.`);
            this.setSkipPodcast(skipPodcastIndex, currentTryCount);
          }
        },
      });
  }

  onResetBtnClicked(podcastIndex: number): void {
    this.postResetSub = this.podcastService
      .updatePodcastStatus(this.podcasts[podcastIndex].podcastId, PodcastStatus.none)
      .subscribe({
        next: (result) => {
          if (result === 'OK') {
            this.podcasts[podcastIndex].status = PodcastStatus.none;
          }
        },
        error: (err) => console.error(err),
      });
  }

  onRowPlayBtnClicked(podcastIndex: number): void {
    this.playPodcast(podcastIndex);
  }

  onRowListenedBtnClick(podcastIndex: number): void {
    this.setPodcastListened(podcastIndex);
  }

  onYtPlayerCreated(isCreated: boolean): void {
    this.isYtPlayerCreated = isCreated;
  }

  onYtEndedEmit(): void {
    this.continueYt = true;
    this.playNext();
  }

  onSelectedTabChange(isYtTabActive: boolean) {
    this.isYt_MatTabActive = isYtTabActive;
  }

  onAudioEnded(): void {
    if (this.currentPlaying === PlayType.podcast) {
      this.setPodcastListened(this.currentPodcastIndex);
    }
    this.playNext();
  }

  onFileInputChange(event: any): void {
    this.uploadedSongs = event.target.files;
  }

  onScrollToPodcastClicked(): void {
    let currentPodcastElem = document.querySelector(
      `[data-url="${this.podcasts[this.currentPodcastIndex].url}"]`,
    );
    const tmp = this.scrollDispatcher.getAncestorScrollContainers(this.el);

    if (!currentPodcastElem || tmp.length === 0) {
      return;
    }

    const matDrawer = tmp[0];
    const podcastPosition =
      matDrawer.measureScrollOffset('top') + currentPodcastElem.getBoundingClientRect().top - 50; // additional 50px margin from top

    matDrawer.scrollTo({ top: podcastPosition, behavior: 'smooth' });
  }

  loadMorePodcast(callback?: Function, retries?: number): void {
    const currentTryCount = retries ? retries + 1 : 1;

    this.isLoadingPodcast = true;

    const lastPodcastId: number | undefined =
      this.podcasts.length > 0 ? this.podcasts[this.podcasts.length - 1].podcastId : undefined;

    this.sub = this.podcastService.getPodcastsToListen(lastPodcastId).subscribe({
      next: (podcasts) => {
        this.isLoadingPodcast = false;
        if (podcasts.length === 0) {
          this.noMorePodcast = true;
        } else {
          this.podcasts = this.podcasts.concat(podcasts);
        }
        this.cdRef.detectChanges();
        if (callback) {
          callback();
        }
      },
      error: (err) => {
        if (currentTryCount >= 10) {
          console.error(`Failed to get podcasts: ${err}. Max retries reached.`);
          this.snackBar.open('Failed to get podcasts. Max retries reached.', 'Close');
        } else {
          console.error(`Failed to get podcasts: ${err}. Will retry again now.`);
          this.loadMorePodcast(callback, currentTryCount);
        }
      },
    });
    this.cdRef.detectChanges();
  }

  private buildYtPlayer() {
    this.currentPlaying = PlayType.youtube;
    this.musicCounter++;
    this.continueYt = true;

    this.stopAllSounds();
    this.ytPlayEmit.emit(this.ytUrl);
    this.preloadPodcast();
  }

  private playPodcast(podcastIndex?: number): void {
    this.currentPlaying = PlayType.podcast;
    this.musicCounter = 0;

    if (this.podcasts.length === 0) {
      return;
    }

    if (podcastIndex === undefined) {
      podcastIndex = this.getNextUnlistenedPodcastIndex();
    } else if (podcastIndex > this.podcasts.length - 1) {
      // if podcast_index is more than max podcast count, meaning, reset to play first one
      podcastIndex = 0;
    }

    this.currentPodcastIndex = podcastIndex;
    this.stopAllSounds();
    const currentPlayPodcast = this.podcasts[podcastIndex];
    this.audioPlayPodcastEmit.emit(currentPlayPodcast);

    this.preloadPodcast();
    this.cdRef.detectChanges();
  }

  private playMusic(): void {
    this.musicCounter++;
    this.stopAllSounds();

    if (this.isYt_MatTabActive) {
      this.playYoutube();
    } else if (this.uploadedSongs === undefined || this.uploadedSongs.length === 0) {
      this.playPodcast();
    } else {
      this.playRandomUserMusic();
      this.preloadPodcast();
    }
  }

  private getNextUnlistenedPodcastIndex(): number {
    let podcast_index = this.currentPodcastIndex + 1;

    while (podcast_index <= this.podcasts.length - 1) {
      if (this.podcasts[podcast_index].status === PodcastStatus.none) {
        break;
      }
      podcast_index++;
    }

    if (podcast_index >= this.podcasts.length) {
      podcast_index = 0;
    }

    return podcast_index;
  }

  private stopAllSounds(): void {
    this.stopAllSoundEmit.emit();
  }

  private playNext(): void {
    if (this.musicCounter < this.alternativeCounter) {
      this.playMusic();
    } else if (this.musicCounter === this.alternativeCounter) {
      if (Math.random() > 0.5) {
        this.playPodcast();
      } else {
        this.playMusic();
      }
    } else {
      this.playPodcast();
    }
  }

  private playYoutube(): void {
    this.currentPlaying = PlayType.youtube;
    if (this.continueYt) {
      this.ytPlayVidEmit.emit();
    } else {
      this.ytNextVidEmit.emit();
    }
  }

  private playRandomUserMusic(): void {
    this.currentPlaying = PlayType.user_music;
    this.stopAllSounds();
    this.audioPlayUserMusicEmit.emit(this.getRandomUserMusic());
  }

  private getRandomUserMusic(): string {
    if (!this.uploadedSongs) {
      // no user music uploaded
      return '';
    }

    const maxFileIndex = this.uploadedSongs.length;
    let url = '';
    let musicIndex = 0;
    let filename = '';

    do {
      musicIndex = this.generateRandomIndex(maxFileIndex);
      filename = this.uploadedSongs[musicIndex].name.trim();
      url = URL.createObjectURL(this.uploadedSongs[musicIndex]);
    } while (filename.substring(filename.length - 3) !== 'mp3');

    return url;
  }

  private generateRandomIndex(max: number) {
    return Math.round(Math.random() * max);
  }

  private preloadPodcast(): void {
    let nextIndex = this.getNextUnlistenedPodcastIndex();

    if (nextIndex === 0 && this.currentPodcastIndex >= 0 && !this.noMorePodcast) {
      this.loadMorePodcast(() => {
        this.preloadPodcast();
      });
      return;
    }

    const nextPlayPodcast = this.podcasts[nextIndex];
    this.preloadPodcastEmit.emit(nextPlayPodcast);
  }

  private setPodcastListened(podcastIndex: number): void {
    console.log(`setting podcast listened: ${this.podcasts[podcastIndex].title}`);

    this.postListenedSub = this.podcastService
      .updatePodcastStatus(this.podcasts[podcastIndex].podcastId, PodcastStatus.listened)
      .subscribe({
        next: (result) => {
          if (result === 'OK') {
            this.podcasts[podcastIndex].status = PodcastStatus.listened;
          } else {
            console.log(
              `Failed to set listened for podcast ${podcastIndex}: ${result}. Will retry again in ${this.retryMilisInterval} millis.`,
            );

            window.setTimeout(() => {
              this.setPodcastListened(podcastIndex);
            }, this.retryMilisInterval);
          }
        },
        error: (err) => {
          console.log(
            `Failed to set listened for podcast ${podcastIndex}: ${err}. Will retry again in ${this.retryMilisInterval} millis.`,
          );
          window.setTimeout(() => {
            this.setPodcastListened(podcastIndex);
          }, this.retryMilisInterval);
        },
      });
  }
}
