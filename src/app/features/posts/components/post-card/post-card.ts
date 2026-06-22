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

  onLikeClick(): void {
    this.likeClicked.emit(this.post());
  }
}