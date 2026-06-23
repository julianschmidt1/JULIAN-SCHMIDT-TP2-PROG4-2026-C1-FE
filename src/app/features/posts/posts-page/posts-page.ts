import { Component, inject, signal } from '@angular/core';
import { PostsService } from '../posts.service.';
import { PostResponse } from '../models/post-response';
import { PostCardComponent } from '../components/post-card/post-card';
import { ReactiveFormsModule } from '@angular/forms';
import { CreatePostComponent } from '../components/create-post/create-post';
import { AuthStorageService } from '../../../core/services/auth-storage';
import { ConfirmationService, MessageService } from 'primeng/api';

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
  private readonly authStorage = inject(AuthStorageService);
  private readonly messageService = inject(MessageService);
  readonly currentUser = this.authStorage.getUser();
  private readonly confirmationService = inject(ConfirmationService);
  loading = signal(false);
  readonly sort = signal<'createdAt' | 'likes'>('createdAt');
  readonly limit = 10;
  readonly hasMorePosts = signal(true);

  ngOnInit(): void {
    this.loadPosts();
  }

  onPostCreated(post: PostResponse): void {
    this.posts.update((posts) => [post, ...posts]);
  }

  onLikeClicked(post: PostResponse): void {
    const request$ = post.likedByCurrentUser
      ? this.postsService.unlike(post.id)
      : this.postsService.like(post.id);

    request$.subscribe({
      next: (updatedPost) => {
        this.posts.update((posts) =>
          posts.map((currentPost) =>
            currentPost.id === updatedPost.id ? updatedPost : currentPost,
          ),
        );
      },
    });
  }

  canDeletePost(post: PostResponse): boolean {
    if (!this.currentUser) {
      return false;
    }

    return (
      post.author.id === this.currentUser.id ||
      this.currentUser.role === 'administrator'
    );
  }

  onDeleteClicked(post: PostResponse): void {
    this.confirmationService.confirm({
      header: 'Eliminar publicación',
      message: '¿Seguro que querés eliminar esta publicación?',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.postsService.delete(post.id).subscribe({
          next: () => {
            this.posts.update((posts) =>
              posts.filter((currentPost) => currentPost.id !== post.id),
            );

            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'La publicación fue eliminada.',
            });
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar la publicación.',
            });
          },
        });
      },
    });
  }

  loadPosts(): void {
    this.loading.set(true);

    this.postsService
      .findAll({
        sort: this.sort(),
        offset: 0,
        limit: this.limit,
      })
      .subscribe({
        next: (posts) => {
          this.posts.set(posts);
          this.hasMorePosts.set(posts.length === this.limit);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  loadMorePosts(): void {
    this.postsService
      .findAll({
        sort: this.sort(),
        offset: this.posts().length,
        limit: this.limit,
      })
      .subscribe({
        next: (newPosts) => {
          this.posts.update((posts) => [...posts, ...newPosts]);
          this.hasMorePosts.set(newPosts.length === this.limit);
        },
      });
  }

  changeSort(sort: 'createdAt' | 'likes'): void {
    this.sort.set(sort);
    this.loadPosts();
  }
}
