import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CommentResponse } from './models/comment-response';
import { GetCommentsQuery } from './models/get-comments-query';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/comments`;

  findByPost(
    postId: string,
    query: GetCommentsQuery = {},
  ): Observable<CommentResponse[]> {
    let params = new HttpParams();

    if (query.offset !== undefined) params = params.set('offset', query.offset);
    if (query.limit !== undefined) params = params.set('limit', query.limit);

    return this.http.get<CommentResponse[]>(`${this.apiUrl}/posts/${postId}`, {
      params,
    });
  }

  create(postId: string, message: string): Observable<CommentResponse> {
    return this.http.post<CommentResponse>(`${this.apiUrl}/posts/${postId}`, {
      message,
    });
  }

  update(commentId: string, message: string): Observable<CommentResponse> {
    return this.http.put<CommentResponse>(`${this.apiUrl}/${commentId}`, {
      message,
    });
  }
}