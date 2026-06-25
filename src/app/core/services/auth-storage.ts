import { Injectable } from '@angular/core';

import { UserResponse } from '../../features/auth/models';

const USER_STORAGE_KEY = 'authenticated-user'
const ACCESS_TOKEN_STORAGE_KEY = 'access-token';;

@Injectable({
  providedIn: 'root',
})
export class AuthStorageService {
  saveUser(user: UserResponse): void {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }

  getUser(): UserResponse | null {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser) as UserResponse;
  }

  saveAccessToken(token: string): void {
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  }

  clear(): void {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  }

  isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }
}