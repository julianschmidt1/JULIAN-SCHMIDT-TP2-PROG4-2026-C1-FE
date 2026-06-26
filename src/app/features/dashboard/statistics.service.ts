import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  CommentsByPostStatistic,
  CommentsOverTimeStatistic,
  DateRangeQuery,
  PostsByUserStatistic,
} from './models/statistics';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/posts/statistics`;

  getPostsByUser(
    query: DateRangeQuery,
  ): Observable<PostsByUserStatistic[]> {
    return this.http.get<PostsByUserStatistic[]>(
      `${this.apiUrl}/posts-by-user`,
      { params: this.buildParams(query) },
    );
  }

  getCommentsOverTime(
    query: DateRangeQuery,
  ): Observable<CommentsOverTimeStatistic[]> {
    return this.http.get<CommentsOverTimeStatistic[]>(
      `${this.apiUrl}/comments-over-time`,
      { params: this.buildParams(query) },
    );
  }

  getCommentsByPost(
    query: DateRangeQuery,
  ): Observable<CommentsByPostStatistic[]> {
    return this.http.get<CommentsByPostStatistic[]>(
      `${this.apiUrl}/comments-by-post`,
      { params: this.buildParams(query) },
    );
  }

  private buildParams(query: DateRangeQuery): HttpParams {
    let params = new HttpParams();

    if (query.from) {
      params = params.set('from', query.from);
    }

    if (query.to) {
      params = params.set('to', query.to);
    }

    return params;
  }
}