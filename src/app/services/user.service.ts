import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IUser } from '../interfaces/user.interface';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private serverUrl = environment.serverUrl;

  constructor(private http: HttpClient) {}

  getUser(token: string) {
    return this.http
      .get<IUser>(`${this.serverUrl}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        map((user) => {
          user.token = token;
          return user;
        }),
      );
  }
}
