import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated(): boolean {
    return !!localStorage.getItem('user');
  }

  setUser(user: Object): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): IUser | null {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  getToken(): string | null {
    return JSON.parse(localStorage.getItem('user') || '{}')?.token;
  }

  logOut(): void {
    localStorage.removeItem('user');
    window.location.href = '/';
  }
}
