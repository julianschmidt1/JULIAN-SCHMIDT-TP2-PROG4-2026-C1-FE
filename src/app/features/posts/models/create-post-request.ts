export interface CreatePostRequest {
  title: string;
  description: string;
  image?: File | null;
}