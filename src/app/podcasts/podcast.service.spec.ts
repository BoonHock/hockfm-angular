import { TestBed } from '@angular/core/testing';

import { PodcastsService } from './podcast.service';

describe('PodcastsService', () => {
  let service: PodcastsService;
  let mockHttpClient;

  beforeEach(() => {
    // TestBed.configureTestingModule({});
    // service = TestBed.inject(PodcastsService);

    mockHttpClient = jasmine.createSpyObj('mockHttpClient', ['get', 'put']);
    service = new PodcastsService(mockHttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
