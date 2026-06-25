import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { PostsService } from '../posts.service.';
import { PostResponse } from '../models/post-response';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthStorageService } from '../../../core/services/auth-storage';
import { CommentsService } from '../../comments/comments.service';
import { CommentResponse } from '../../comments/models/comment-response';
import { ButtonDirective } from 'primeng/button';

@Component({
  selector: 'app-post-detail',
  imports: [DatePipe, RouterLink, ReactiveFormsModule, ButtonDirective],
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.scss',
})
export class PostDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly postsService = inject(PostsService);
  readonly post = signal<PostResponse | null>(null);
  readonly loading = signal(false);

  private readonly fb = inject(FormBuilder);
  private readonly commentsService = inject(CommentsService);
  private readonly authStorage = inject(AuthStorageService);
  readonly currentUser = this.authStorage.getUser();
  readonly comments = signal<CommentResponse[]>([]);
  readonly hasMoreComments = signal(true);
  readonly commentsLimit = 5;
  readonly commentForm = this.fb.nonNullable.group({
    message: ['', [Validators.required, Validators.maxLength(500)]],
  });

  readonly editingCommentId = signal<string | null>(null);

  readonly editCommentForm = this.fb.nonNullable.group({
    message: ['', [Validators.required, Validators.maxLength(500)]],
  });

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');

    if (!postId) {
      return;
    }

    this.loading.set(true);

    this.postsService.findById(postId).subscribe({
      next: (post) => {
        this.post.set(post);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });

    this.loadComments(postId);
  }

  private loadComments(postId: string): void {
    this.commentsService
      .findByPost(postId, {
        offset: 0,
        limit: this.commentsLimit,
      })
      .subscribe({
        next: (comments) => {
          this.comments.set(comments);
          this.hasMoreComments.set(
            comments.length === this.commentsLimit,
          );
        },
      });
  }

  loadMoreComments(): void {
    const post = this.post();

    if (!post) {
      return;
    }

    this.commentsService
      .findByPost(post.id, {
        offset: this.comments().length,
        limit: this.commentsLimit,
      })
      .subscribe({
        next: (comments) => {
          this.comments.update((current) => [
            ...current,
            ...comments,
          ]);

          this.hasMoreComments.set(
            comments.length === this.commentsLimit,
          );
        },
      });
  }

  createComment(): void {
    const post = this.post();

    if (!post || this.commentForm.invalid) {
      return;
    }

    this.commentsService
      .create(
        post.id,
        this.commentForm.getRawValue().message,
      )
      .subscribe({
        next: (comment) => {
          this.comments.update((comments) => [
            comment,
            ...comments,
          ]);

          this.commentForm.reset();
        },
      });
  }

  canEditComment(comment: CommentResponse): boolean {
    return this.currentUser?.id === comment.author.id;
  }

  startEditComment(comment: CommentResponse): void {
    this.editingCommentId.set(comment.id);
    this.editCommentForm.setValue({
      message: comment.message,
    });
  }

  cancelEditComment(): void {
    this.editingCommentId.set(null);
    this.editCommentForm.reset();
  }

  onLikeClicked(): void {
    const currentPost = this.post();

    if (!currentPost) {
      return;
    }

    const request$ = currentPost.likedByCurrentUser
      ? this.postsService.unlike(currentPost.id)
      : this.postsService.like(currentPost.id);

    request$.subscribe({
      next: (updatedPost) => {
        this.post.set(updatedPost);
      },
    });
  }

  saveEditedComment(comment: CommentResponse): void {
    if (this.editCommentForm.invalid) {
      this.editCommentForm.markAllAsTouched();
      return;
    }

    const message = this.editCommentForm.getRawValue().message;

    this.commentsService.update(comment.id, message).subscribe({
      next: (updatedComment) => {
        this.comments.update((comments) =>
          comments.map((currentComment) =>
            currentComment.id === updatedComment.id
              ? updatedComment
              : currentComment,
          ),
        );

        this.cancelEditComment();
      },
    });
  }
}