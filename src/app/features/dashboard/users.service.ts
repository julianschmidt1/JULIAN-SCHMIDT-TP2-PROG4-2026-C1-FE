import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { UserResponse } from '../auth/models/user-response';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/users`;

  findAll(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.apiUrl);
  }

  create(formData: FormData): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.apiUrl, formData);
  }

  disable(userId: string): Observable<UserResponse> {
    return this.http.delete<UserResponse>(`${this.apiUrl}/${userId}`);
  }

  restore(userId: string): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/${userId}/restore`, {});
  }
}