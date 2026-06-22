export interface PostAuthorResponse {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  profileImageUrl: string;
}

export interface PostResponse {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  author: PostAuthorResponse;
  likes: number;
  likedByCurrentUser: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}