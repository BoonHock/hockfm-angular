import { TestBed } from '@angular/core/testing';

import { SubscriptionService } from './subscription.service';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let mockHttpClient;

  beforeEach(() => {
    // TestBed.configureTestingModule({});
    // service = TestBed.inject(SubscriptionService);

    mockHttpClient = jasmine.createSpyObj('mockHttpClient', ['get', 'post']);
    service = new SubscriptionService(mockHttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
