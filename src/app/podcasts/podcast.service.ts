import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PodcastStatus } from '../shared/enum/podcast-status';
import { IPodcast } from './podcast';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PodcastsService {
  private serverUrl = environment.serverUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * @loadMore is the last podcast id in the loaded podcasts
   * since they are arrange from latest to earliest, so will load earlier podcasts
   *  */
  getPodcastsToListen(loadMore: string): Observable<IPodcast[]> {
    return this.http
      .get<IPodcast[]>(`${this.serverUrl}/podcasts?load_more=${loadMore}`, {
        ...(this.authService.isAuthenticated()
          ? {
              headers: {
                Authorization: `Bearer ${this.authService.getToken()}`,
              },
            }
          : {}),
      })
      .pipe(
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

  getPodcastToListen(id: string): Observable<IPodcast | null> {
    return this.http
      .get<IPodcast>(`${this.serverUrl}/podcasts/${id}`)
      .pipe(catchError(this.handleError));
  }

  updatePodcastStatus(id: string, status: PodcastStatus): Observable<string> {
    if (!this.authService.isAuthenticated()) {
      // lazy to update all other parts. Quick hack
      return of('OK');
    }

    return this.http
      .post(
        `${this.serverUrl}/podcast-statuses/${id}`,
        { status: status },
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
            'Content-Type': 'application/json',
          }),
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
}
