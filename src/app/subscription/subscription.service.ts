import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ISubscription } from './subscription';
import { ISubscriptionGrouped } from './subscription-grouped';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private serverUrl = environment.serverUrl;
  // private getUrl = environment.getSubscriptionUrl;
  // private postUrl = environment.postPodcastUrl;

  constructor(private http: HttpClient) {}

  getSubscriptions(): Observable<ISubscriptionGrouped[]> {
    // const requestOptions: Object = {
    //   /* other options here */
    //   responseType: 'text'
    // }
    return this.http.get<ISubscription[]>(`${this.serverUrl}/subscription`).pipe(
      map((data) => {
        data.map((sub) => {
          sub.b_is_subscribed = sub.is_subscribed == 1;
          return sub;
        });
        const subGrouped = data.reduce<ISubscriptionGrouped[]>((grouped, currVal) => {
          const channelGrouped = grouped.find((obj) => {
            return obj.channel_name === currVal.channel_name;
          });
          if (channelGrouped === undefined) {
            grouped.push({
              channel: currVal.channel,
              channel_name: currVal.channel_name,
              playlists: [currVal],
              // is_fully_subscribed() {
              //   return this.playlists.find(p => p.b_is_subscribed === false) === undefined;
              // }
            });
          } else {
            channelGrouped.playlists.push(currVal);
          }
          return grouped;
        }, []);
        return subGrouped;
      }),
      // tap(data => console.log(data)),
      catchError(this.handleError),
    );
  }

  subscribePlaylists(subscriptionGrouped: ISubscriptionGrouped[]): Observable<any> {
    const playlists = subscriptionGrouped.reduce<number[]>((arr, currVal) => {
      const p2 = currVal.playlists.reduce<number[]>((p_arr, currVal2) => {
        if (currVal2.b_is_subscribed) {
          p_arr.push(currVal2.playlist);
        }
        return p_arr;
      }, []);
      return arr.concat(p2);
    }, []);

    let HTTPOptions: Object = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'text',
      // responseType: 'json'
    };

    return this.http
      .post(`${this.serverUrl}/subscription`, { subscribe_playlist: playlists }, HTTPOptions)
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
