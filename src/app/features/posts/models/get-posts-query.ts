export interface GetPostsQuery {
  sort?: 'createdAt' | 'likes';
  offset?: number;
  limit?: number;
  userId?: string;
}