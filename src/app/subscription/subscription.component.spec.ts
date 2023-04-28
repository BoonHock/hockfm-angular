import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionComponent } from './subscription.component';

describe('SubscriptionComponent', () => {
  let component: SubscriptionComponent;
  let fixture: ComponentFixture<SubscriptionComponent>;
  let mockSubscriptionService;

  beforeEach(async () => {
    mockSubscriptionService = jasmine.createSpyObj([
      'getSubscriptions',
      'subscribePlaylists',
    ]);
    // await TestBed.configureTestingModule({
    //   declarations: [SubscriptionComponent],
    // }).compileComponents();

    // fixture = TestBed.createComponent(SubscriptionComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();

    component = new SubscriptionComponent(mockSubscriptionService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
