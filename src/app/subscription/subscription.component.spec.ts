import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionComponent } from './subscription.component';
import { SubscriptionService } from './subscription.service';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ISubscriptionGrouped } from './subscription-grouped';
import { ISubscription } from './subscription';
import { By } from '@angular/platform-browser';

describe('SubscriptionComponent', () => {
  let component: SubscriptionComponent;
  let fixture: ComponentFixture<SubscriptionComponent>;
  let mockSubscriptionService: any;

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

  beforeEach(async () => {
    mockSubscriptionService = jasmine.createSpyObj([
      'getSubscriptions',
      'subscribePlaylists',
    ]);
    await TestBed.configureTestingModule({
      declarations: [SubscriptionComponent],
      providers: [
        { provide: SubscriptionService, useValue: mockSubscriptionService },
      ],
      imports: [FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SubscriptionComponent);
    component = fixture.componentInstance;
    mockSubscriptionService.getSubscriptions.and.returnValue(
      of(SUBSCRIPTION_GROUPED)
    );

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get subscriptions', () => {
    expect(component.subscriptionGrouped).toEqual(SUBSCRIPTION_GROUPED);
  });

  it('should have 2 playlist checkboxes', () => {
    const checkboxes = fixture.debugElement.queryAll(
      By.css('form > div.form-group div.form-check input')
    );

    expect(checkboxes.length).toBe(2);
  });

  it('channel checkbox should be checked', () => {
    // check all playlist checkboxes
    const playlistCbs = fixture.debugElement.queryAll(
      By.css('form > div.form-group div.form-check input')
    );

    playlistCbs.forEach((cb) => {
      cb.nativeElement.checked = true;
      cb.nativeElement.dispatchEvent(new Event('change'));
    });

    // check if channel input is checked
    const channelCb = fixture.debugElement.query(
      By.css('form > div.form-group > label.form-check-label input')
    );

    fixture.detectChanges();
    expect(channelCb.nativeElement.checked).toBe(true);
  });

  it('should get channel not fully subscribed', () => {
    // uncheck any playlist checkboxes
    const playlistCbs = fixture.debugElement.queryAll(
      By.css('form > div.form-group div.form-check input')
    );

    playlistCbs[0].nativeElement.checked = false;
    playlistCbs[0].nativeElement.dispatchEvent(new Event('change'));

    // check if channel input is not checked
    const channelCb = fixture.debugElement.query(
      By.css('form > div.form-group > label.form-check-label input')
    );
    fixture.detectChanges();
    expect(channelCb.nativeElement.checked).toBe(false);
  });

  describe('submit', () => {
    it('should call onSubmit', () => {
      // check onSubmit() method
      spyOn(component, 'onSubmit');

      const form = fixture.debugElement.query(By.css('form'));
      form.triggerEventHandler('submit', null);

      expect(component.onSubmit).toHaveBeenCalled();
    });

    it('should receive response and successfully save', () => {
      mockSubscriptionService.subscribePlaylists.and.returnValue(of('OK'));

      fixture.detectChanges();
      const form = fixture.debugElement.query(By.css('form'));
      form.triggerEventHandler('submit', null);

      expect(component.formResponseReceived).toBe(true);
      expect(component.saveSuccess).toBe(true);
    });
  });
});
