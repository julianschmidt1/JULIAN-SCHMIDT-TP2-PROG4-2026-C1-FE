import { Component, inject, signal } from '@angular/core';
import { PostsService } from '../posts.service.';
import { PostResponse } from '../models/post-response';
import { PostCardComponent } from '../components/post-card/post-card';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ButtonDirective } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
import { CreatePostComponent } from '../components/create-post/create-post';

@Component({
  selector: 'app-posts-page',
  imports: [
    PostCardComponent,
    ReactiveFormsModule,
    PostCardComponent,
    CreatePostComponent,
  ],
  templateUrl: './posts-page.html',
  styleUrl: './posts-page.scss',
})
export class PostsPage {
  private readonly postsService = inject(PostsService);
  readonly posts = signal<PostResponse[]>([]);
  loading = signal(false);

  ngOnInit(): void {
    this.loadPosts();
  }

  onPostCreated(post: PostResponse): void {
    this.posts.update((posts) => [post, ...posts]);
  }

  onLikeClicked(post: PostResponse): void {
    this.postsService.toggleLike(post.id).subscribe({
      next: (updatedPost) => {
        this.posts.update((posts) =>
          posts.map((currentPost) =>
            currentPost.id === updatedPost.id ? updatedPost : currentPost,
          ),
        );
      },
    });
  }

  private loadPosts(): void {
    this.loading.set(true);

    this.postsService
      .findAll({
        sort: 'createdAt',
        offset: 0,
        limit: 10,
      })
      .subscribe({
        next: (posts) => {
          this.posts.set(posts);
          console.log({ posts });

          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }
}
