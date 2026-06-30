export interface DateRangeQuery {
  from?: string;
  to?: string;
}

export interface PostsByUserStatistic {
  userId: string;
  user: string;
  posts: number;
}

export interface CommentsOverTimeStatistic {
  date: string;
  comments: number;
}

export interface CommentsByPostStatistic {
  postId: string;
  post: string;
  comments: number;
}