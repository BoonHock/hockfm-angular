import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IPodcast } from './podcast';
import { PodcastsService } from './podcast.service';

@Component({
  selector: 'hfm-podcast-detail',
  templateUrl: './podcast-detail.component.html',
  styleUrls: ['./podcast-detail.component.scss'],
})
export class PodcastDetailComponent implements OnInit, OnDestroy {
  podcast: IPodcast | null = null;

  private sub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private podcastService: PodcastsService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.sub = this.podcastService.getPodcastToListen(id).subscribe({
        next: (podcast) => {
          if (podcast === null) {
            // no podcast with specified id. route back to home page
            this.router.navigate(['']);
          }
          this.podcast = podcast;
        },
        error: (err) => console.error(err),
      });
    } else {
      // no id specified. route back to home page
      this.router.navigate(['']);
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
