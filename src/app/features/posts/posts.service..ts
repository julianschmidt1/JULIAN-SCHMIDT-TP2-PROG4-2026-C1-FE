import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthStorageService } from '../../core/services/auth-storage';
import { environment } from '../../../environments/environment';
import { GetPostsQuery } from './models/get-posts-query';
import { PostResponse } from './models/post-response';


@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly http = inject(HttpClient);
  private readonly authStorage = inject(AuthStorageService);

  private readonly apiUrl = `${environment.apiUrl}/posts`;

  findAll(query: GetPostsQuery = {}): Observable<PostResponse[]> {
    const user = this.authStorage.getUser();

    let params = new HttpParams();

    if (query.sort) params = params.set('sort', query.sort);
    if (query.offset !== undefined) params = params.set('offset', query.offset);
    if (query.limit !== undefined) params = params.set('limit', query.limit);
    if (query.userId) params = params.set('userId', query.userId);

    return this.http.get<PostResponse[]>(this.apiUrl, {
      params,
      headers: {
        'x-user-id': user?.id ?? '',
      },
    });
  }
  create(formData: FormData): Observable<PostResponse> {
    const user = this.authStorage.getUser();

    return this.http.post<PostResponse>(this.apiUrl, formData, {
      headers: {
        'x-user-id': user?.id ?? '',
      },
    });
  }

  delete(postId: string): Observable<PostResponse> {
    const user = this.authStorage.getUser();

    return this.http.delete<PostResponse>(`${this.apiUrl}/${postId}`, {
      headers: {
        'x-user-id': user?.id ?? '',
        'x-user-role': user?.role ?? '',
      },
    });
  }

  toggleLike(postId: string): Observable<PostResponse> {
    const user = this.authStorage.getUser();

    return this.http.post<PostResponse>(
      `${this.apiUrl}/${postId}/like`,
      {},
      {
        headers: {
          'x-user-id': user?.id ?? '',
        },
      },
    );
  }
}