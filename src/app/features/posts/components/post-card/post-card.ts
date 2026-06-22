import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { PostResponse } from '../../models/post-response';

@Component({
  selector: 'app-post-card',
  imports: [DatePipe],
  templateUrl: './post-card.html',
  styleUrl: './post-card.scss',
})
export class PostCardComponent {
  readonly post = input.required<PostResponse>();
  readonly likeClicked = output<PostResponse>();
  readonly deleteClicked = output<PostResponse>();
  readonly canDelete = input<boolean>(false);

  onDeleteClick(): void {
    this.deleteClicked.emit(this.post());
  }

  onLikeClick(): void {
    this.likeClicked.emit(this.post());
  }
}