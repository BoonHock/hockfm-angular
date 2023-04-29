import { TestBed } from '@angular/core/testing';

import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { SubscriptionService } from './subscription.service';
import { environment } from 'src/environments/environment';
import { ISubscription } from './subscription';
import { ISubscriptionGrouped } from './subscription-grouped';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let httpTestingController: HttpTestingController;

  const SUBSCRIPTIONS: ISubscription[] = [
    {
      channel: 1,
      channel_name: 'channel name',
      playlist: 1,
      playlist_name: 'playlist name',
      description: 'playlist desc',
      is_subscribed: 0,
      b_is_subscribed: false,
    },
    {
      channel: 1,
      channel_name: 'channel name',
      playlist: 2,
      playlist_name: 'playlist name 2',
      description: 'playlist desc 2',
      is_subscribed: 1,
      b_is_subscribed: true,
    },
  ];

  const SUBSCRIPTION_GROUPED: ISubscriptionGrouped[] = [
    {
      channel: 1,
      channel_name: 'channel name',
      playlists: SUBSCRIPTIONS,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(SubscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get subscriptions', () => {
    service
      .getSubscriptions()
      .subscribe((data) => expect(data).toEqual(SUBSCRIPTION_GROUPED));

    const req = httpTestingController.expectOne(
      `${environment.serverUrl}/subscription`
    );

    req.flush(SUBSCRIPTIONS);
    httpTestingController.verify();

    expect(req.request.method).toEqual('GET');
  });

  it('should post subscription', () => {
    service.subscribePlaylists([]).subscribe();

    const req = httpTestingController.expectOne(
      `${environment.serverUrl}/subscription`
    );

    expect(req.request.method).toEqual('POST');
    req.flush('OK');
    httpTestingController.verify();
  });
});
