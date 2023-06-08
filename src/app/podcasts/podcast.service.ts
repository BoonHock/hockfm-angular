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
  getPodcastsToListen(loadMore?: number): Observable<IPodcast[]> {
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
