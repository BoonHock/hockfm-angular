import { ISubscription } from './subscription';

export interface ISubscriptionGrouped {
  channel: number;
  channel_name: string;
  playlists: ISubscription[];
  // is_fully_subscribed(): boolean
}
