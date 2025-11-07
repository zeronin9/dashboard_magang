// Login & Auth Types
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
  user?: User;
  token?: string;
  message?: string;
}
