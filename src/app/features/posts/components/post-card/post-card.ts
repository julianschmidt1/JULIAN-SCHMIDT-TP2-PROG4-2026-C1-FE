import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { PostResponse } from '../../models/post-response';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-card',
imports: [DatePipe, RouterLink],
  templateUrl: './post-card.html',
  styleUrl: './post-card.scss',
})
export class PostCardComponent {
  readonly post = input.required<PostResponse>();
  readonly likeClicked = output<PostResponse>();
  readonly deleteClicked = output<PostResponse>();
  readonly canDelete = input<boolean>(false);
  readonly showActions = input(true);
  
  onDeleteClick(): void {
    this.deleteClicked.emit(this.post());
  }

  onLikeClick(): void {
    this.likeClicked.emit(this.post());
  }
}