import { Injectable } from '@angular/core';

import { UserResponse } from '../../features/auth/models';

const USER_STORAGE_KEY = 'authenticated-user';

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

  clear(): void {
    localStorage.removeItem(USER_STORAGE_KEY);
  }

  isAuthenticated(): boolean {
    return this.getUser() !== null;
  }
}