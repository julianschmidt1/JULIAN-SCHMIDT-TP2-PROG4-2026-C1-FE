import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';

import { StatisticsService } from '../statistics.service';
import { forkJoin } from 'rxjs';
import { ButtonDirective } from "primeng/button";

@Component({
  selector: 'app-statistics-dashboard',
  imports: [ReactiveFormsModule, ChartModule, ButtonDirective],
  templateUrl: './statistics-dashboard.html',
  styleUrl: './statistics-dashboard.scss',
})
export class StatisticsDashboard implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly statisticsService = inject(StatisticsService);

  readonly loading = signal(false);

  readonly filtersForm = this.fb.nonNullable.group({
    from: [''],
    to: [''],
  });

  readonly postsByUserData = signal<unknown>(null);
  readonly commentsOverTimeData = signal<unknown>(null);
  readonly commentsByPostData = signal<unknown>(null);

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.loading.set(true);

    const query = this.filtersForm.getRawValue();

    forkJoin({
      postsByUser: this.statisticsService.getPostsByUser(query),
      commentsOverTime: this.statisticsService.getCommentsOverTime(query),
      commentsByPost: this.statisticsService.getCommentsByPost(query),
    }).subscribe({
      next: ({ postsByUser, commentsOverTime, commentsByPost }) => {
        this.postsByUserData.set({
          labels: postsByUser.map((item) => item.user),
          datasets: [
            {
              label: 'Publicaciones',
              data: postsByUser.map((item) => item.posts),
            },
          ],
        });

        this.commentsOverTimeData.set({
          labels: commentsOverTime.map((item) => item.date),
          datasets: [
            {
              label: 'Comentarios',
              data: commentsOverTime.map((item) => item.comments),
            },
          ],
        });

        this.commentsByPostData.set({
          labels: commentsByPost.map((item) => item.post),
          datasets: [
            {
              label: 'Comentarios',
              data: commentsByPost.map((item) => item.comments),
            },
          ],
        });

        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}