import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GetPostsQuery } from './models/get-posts-query';
import { PostResponse } from './models/post-response';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/posts`;

  findAll(query: GetPostsQuery = {}): Observable<PostResponse[]> {
    let params = new HttpParams();

    if (query.sort) params = params.set('sort', query.sort);
    if (query.offset !== undefined) params = params.set('offset', query.offset);
    if (query.limit !== undefined) params = params.set('limit', query.limit);
    if (query.userId) params = params.set('userId', query.userId);

    return this.http.get<PostResponse[]>(this.apiUrl, { params });
  }

  findById(postId: string): Observable<PostResponse> {
    return this.http.get<PostResponse>(`${this.apiUrl}/${postId}`);
  }

  create(formData: FormData): Observable<PostResponse> {
    return this.http.post<PostResponse>(this.apiUrl, formData);
  }

  delete(postId: string): Observable<PostResponse> {
    return this.http.delete<PostResponse>(`${this.apiUrl}/${postId}`);
  }

  like(postId: string): Observable<PostResponse> {
    return this.http.post<PostResponse>(`${this.apiUrl}/${postId}/like`, {});
  }

  unlike(postId: string): Observable<PostResponse> {
    return this.http.delete<PostResponse>(`${this.apiUrl}/${postId}/like`);
  }
}