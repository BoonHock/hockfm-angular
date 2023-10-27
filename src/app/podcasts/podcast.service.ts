import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PodcastStatus } from '../shared/enum/podcast-status';
import { IPodcast } from './podcast';

@Injectable({
  providedIn: 'root',
})
export class PodcastsService {
  private serverUrl = environment.serverUrl;

  constructor(private http: HttpClient) {}

  /**
   * @loadMore is the last podcast id in the loaded podcasts
   * since they are arrange from latest to earliest, so will load earlier podcasts
   *  */
  getPodcastsToListen(loadMore: string): Observable<IPodcast[]> {
    return this.http.get<IPodcast[]>(`${this.serverUrl}/podcasts?load_more=${loadMore}`).pipe(
      map((data) => {
        return data.map((podcast) => {
          switch (podcast.status) {
            case 1:
              podcast.status = PodcastStatus.listened;
              break;
            case 2:
              podcast.status = PodcastStatus.skipped;
              break;
            default:
              podcast.status = PodcastStatus.none;
          }
          return podcast;
        });
      }),
      catchError(this.handleError),
    );
  }

  getPodcastToListen(podcastId: number): Observable<IPodcast | null> {
    return this.http
      .get<IPodcast>(`${this.serverUrl}/podcasts/${podcastId}`)
      .pipe(catchError(this.handleError));
  }

  updatePodcastStatus(podcastId: number, status: PodcastStatus): Observable<string> {
    return this.http
      .put(
        `${this.serverUrl}/podcasts/${podcastId}/status`,
        { status: status },
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
          responseType: 'text',
        },
      )
      .pipe(catchError(this.handleError));
  }

  getLatestChannelId() {
    return this.http
      .get<number>(`${this.serverUrl}/channels/latestChannelId`)
      .pipe(catchError(this.handleError));
  }

  getNewChannels(latestChannelId: number): Observable<any[]> {
    return this.http
      .get<any[]>(`${environment.getNewChannelsUrl}?latestId=${latestChannelId}`)
      .pipe(catchError(this.handleError));
  }

  addNewChannelsToDb(data: any[]) {
    return this.http
      .post(`${this.serverUrl}/webhook/addNewChannels`, data, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        responseType: 'text',
      })
      .pipe(catchError(this.handleError));
  }

  getLatestPlaylistId() {
    return this.http
      .get<number>(`${this.serverUrl}/playlists/latestPlaylistId`)
      .pipe(catchError(this.handleError));
  }

  getNewPlaylists(latestPlaylistId: number): Observable<any[]> {
    return this.http
      .get<any[]>(`${environment.getNewPlaylistsUrl}?latestId=${latestPlaylistId}`)
      .pipe(catchError(this.handleError));
  }

  addNewPlaylistsToDb(data: any[]) {
    return this.http
      .post(`${this.serverUrl}/webhook/addNewPlaylists`, data, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        responseType: 'text',
      })
      .pipe(catchError(this.handleError));
  }

  getLatestPodcastId() {
    return this.http
      .get<number>(`${this.serverUrl}/podcasts/misc/latestPodcastId`)
      .pipe(catchError(this.handleError));
  }

  getNewPodcasts(latestPodcastId: number): Observable<any[]> {
    return this.http
      .get<any[]>(`${environment.getNewPodcastsUrl}?latestId=${latestPodcastId}`)
      .pipe(catchError(this.handleError));
  }

  addNewPodcastsToDb(data: any[]) {
    return this.http
      .post(`${this.serverUrl}/webhook/addNewPodcasts`, data, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        responseType: 'text',
      })
      .pipe(catchError(this.handleError));
  }

  getUnprocessedRunTokens(): Observable<string[]> {
    return this.http
      .get<string[]>(`${environment.getUnprocessedRunTokens}`)
      .pipe(catchError(this.handleError));
  }

  loadParsehubToDB(runToken: string) {
    return this.http
      .post<{ status: string; data: any }>(
        `${this.serverUrl}/webhook/loadParsehubToDB?runToken=${runToken}`,
        {},
      )
      .pipe(catchError(this.handleError));
  }

  setTokenProcessed(runToken: string) {
    return this.http
      .get(`${environment.setTokenProcessed}?token=${runToken}`, {})
      .pipe(catchError(this.handleError));
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';

    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.message}`;
    } else {
      errorMessage = `Server returned error: ${err.status}, error message is: ${err.message}`;
    }

    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
  // private utf8_decode(text: string): string {
  //   return decodeURIComponent(text);
  // }
}
