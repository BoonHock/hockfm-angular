import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PodcastDetailComponent } from './podcast-detail.component';
import { of } from 'rxjs';
import { PodcastsService } from './podcast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PodcastStatus } from '../shared/enum/podcast-status';
import { By } from '@angular/platform-browser';

describe('PodcastDetailComponent', () => {
  let component: PodcastDetailComponent;
  let fixture: ComponentFixture<PodcastDetailComponent>;
  let mockPodcastService: any;
  let mockRoute: any;
  let mockRouter;
  let PODCASTS = [
    {
      id: '1',
      title: 'title none',
      description: 'description none',
      url: 'https://megaphone-prod.s3.amazonaws.com/podcasts/94081b56-c88a-11ed-8e38-1b845169ba6e/episodes/5aa25130-e4b7-11ed-87e6-ffc03737b938/stripped_06ebb33430fb024742036683600d2f6a.mp3',
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
    mockPodcastService = jasmine.createSpyObj(['getPodcastToListen']);
    mockRoute = {
      snapshot: {
        paramMap: {
          get: () => {
            return '1';
          },
        },
      },
    };
    mockRouter = jasmine.createSpyObj(['navigate']);

    TestBed.configureTestingModule({
      declarations: [PodcastDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: PodcastsService, useValue: mockPodcastService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    fixture = TestBed.createComponent(PodcastDetailComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
    mockPodcastService.getPodcastToListen.and.returnValue(of(PODCASTS[0]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get correct podcast', () => {
    expect(component.podcast?.id).toEqual('1');
  });

  it('should render podcast title in h2 tag', () => {
    // NativeElement method
    // expect(fixture.nativeElement.querySelector('h2').textContent).toContain(
    //   'title none'
    // );

    // DebugElement method
    expect(fixture.debugElement.query(By.css('h2')).nativeElement.textContent).toContain(
      'title none',
    );
  });

  it('should render channel name in p.lead', () => {
    expect(fixture.debugElement.query(By.css('p.lead')).nativeElement.textContent).toContain(
      'channel name',
    );
  });

  it('should render podcast url in audio tag', () => {
    expect(fixture.debugElement.query(By.css('audio')).nativeElement.src).toContain(
      'https://megaphone-prod.s3.amazonaws.com/podcasts/94081b56-c88a-11ed-8e38-1b845169ba6e/episodes/5aa25130-e4b7-11ed-87e6-ffc03737b938/stripped_06ebb33430fb024742036683600d2f6a.mp3',
    );
  });
});
