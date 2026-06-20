import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  LoginRequest,
  RegisterRequest,
  UserResponse,
} from './models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/auth`;

  login(request: LoginRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(
      `${this.apiUrl}/login`,
      request,
    );
  }

  register(request: FormData): Observable<UserResponse> {
    return this.http.post<UserResponse>(
      `${this.apiUrl}/register`,
      request,
    );
  }
}