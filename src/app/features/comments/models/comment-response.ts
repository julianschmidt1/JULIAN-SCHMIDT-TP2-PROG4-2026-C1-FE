export interface CommentAuthorResponse {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  profileImageUrl?: string;
}

export interface CommentResponse {
  id: string;
  post: string;
  message: string;
  modified: boolean;
  createdAt: string;
  updatedAt: string;
  author: CommentAuthorResponse;
}