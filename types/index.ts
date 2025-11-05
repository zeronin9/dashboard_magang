export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  name: string;
  role: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode?: number;
}