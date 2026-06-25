import { UserResponse } from "./user-response";

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface AuthResponse {
  user: UserResponse;
  accessToken: string;
}