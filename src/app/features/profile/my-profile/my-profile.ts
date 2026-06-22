import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthStorageService } from '../../../core/services/auth-storage';
import { DatePipe } from '@angular/common';
import { PostCardComponent } from '../../posts/components/post-card/post-card';
import { PostsService } from '../../posts/posts.service.';
import { PostResponse } from '../../posts/models/post-response';


@Component({
  selector: 'app-my-profile',
  imports: [DatePipe, PostCardComponent],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.scss',
})
export class MyProfile implements OnInit {
  private readonly authStorage = inject(AuthStorageService);
  readonly user = this.authStorage.getUser();
  private readonly postsService = inject(PostsService);
  readonly latestPosts = signal<PostResponse[]>([]);
  readonly loadingPosts = signal(false);

  ngOnInit(): void {
    this.loadLatestPosts();
  }

  private loadLatestPosts(): void {
    if (!this.user) {
      return;
    }

    this.loadingPosts.set(true);

    this.postsService
      .findAll({
        sort: 'createdAt',
        offset: 0,
        limit: 3,
        userId: this.user.id,
      })
      .subscribe({
        next: (posts) => {
          this.latestPosts.set(posts);
          this.loadingPosts.set(false);
        },
        error: () => {
          this.loadingPosts.set(false);
        },
      });
  }

  readonly roleLabels: Record<string, string> = {
    user: 'Usuario',
    administrator: 'Administrador',
  } as const;

  getRoleLabel(role: string): string {
    return this.roleLabels[role as keyof typeof this.roleLabels] ?? role;
  }
}