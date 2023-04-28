import { PodcastStatus } from '../shared/enum/podcast-status';

export interface IPodcast {
  podcastId: number;
  title: string;
  description: string;
  url: string;
  date: string;
  status: PodcastStatus;
  playlist: {
    title: string;
    channel: {
      name: string;
    };
  };
}
