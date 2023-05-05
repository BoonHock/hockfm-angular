import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ISubscriptionGrouped } from './subscription-grouped';
import { SubscriptionService } from './subscription.service';

@Component({
  selector: 'hfm-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
})
export class SubscriptionComponent implements OnInit, OnDestroy {
  subscriptionGrouped: ISubscriptionGrouped[] = [];
  formResponseReceived = false;
  saveSuccess = false;
  saveFailErrorMsg = '';

  private sub!: Subscription;
  private postSubscribeSub!: Subscription;

  constructor(private subscriptionService: SubscriptionService) {}

  ngOnInit(): void {
    this.getSubscriptions();
  }

  getSubscriptions(retries?: number): void {
    const currentTryCount = retries ? retries + 1 : 1;

    this.sub = this.subscriptionService.getSubscriptions().subscribe({
      next: (subs) => {
        this.subscriptionGrouped = subs;
      },
      error: (err) => {
        if (currentTryCount >= 10) {
          console.error(
            `Failed to get subscriptions: ${err}. Max retries reached.`
          );
        } else {
          console.error(
            `Failed to get subscriptions: ${err}. Will retry again now.`
          );
          this.getSubscriptions(currentTryCount);
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    if (this.postSubscribeSub) {
      this.postSubscribeSub.unsubscribe();
    }
  }

  onChannelCheckChange(isChecked: boolean, sg: ISubscriptionGrouped): void {
    sg.playlists.map((p) => {
      return (p.b_is_subscribed = isChecked);
    });
  }

  onSubmit(): void {
    this.formResponseReceived = false;
    this.postSubscribeSub = this.subscriptionService
      .subscribePlaylists(this.subscriptionGrouped)
      .subscribe({
        next: (result) => {
          this.formResponseReceived = true;
          if (result === 'OK') {
            this.saveSuccess = true;
          } else {
            this.saveSuccess = false;
            this.saveFailErrorMsg = result;
            console.error(result);
          }
        },
      });
  }

  isChannelFullSubscribed(subGrouped: ISubscriptionGrouped): boolean {
    return (
      subGrouped.playlists.find((obj) => obj.b_is_subscribed === false) ===
      undefined
    );
  }
}
