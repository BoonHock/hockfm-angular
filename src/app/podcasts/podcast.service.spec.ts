import { TestBed } from '@angular/core/testing';

import { PodcastsService } from './podcast.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IPodcast } from './podcast';
import { PodcastStatus } from '../shared/enum/podcast-status';
import { environment } from 'src/environments/environment';

describe('PodcastsService', () => {
  let service: PodcastsService;
  let httpTestingController: HttpTestingController;
  const PODCASTS: IPodcast[] = [
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(PodcastsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get podcast', () => {
    const id: string = '1';
    service.getPodcastToListen(id).subscribe();

    const req = httpTestingController.expectOne(`${environment.serverUrl}/podcasts/${id}`);

    req.flush(PODCASTS[0]);
    httpTestingController.verify();

    expect(req.request.method).toEqual('GET');
  });

  it('should update podcast status', () => {
    const id: string = '1';
    const status: PodcastStatus = PodcastStatus.listened;
    service.updatePodcastStatus(id, status).subscribe();

    const req = httpTestingController.expectOne(`${environment.serverUrl}/podcasts/${id}/status`);

    req.flush({});
    httpTestingController.verify();

    expect(req.request.method).toEqual('PUT');
  });
});
