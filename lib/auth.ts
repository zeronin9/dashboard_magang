import { LoginCredentials, AuthResponse, LoginResponse, User } from '@/types';  // ← TAMBAH User
import { api, ApiError } from './api';

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await api.post<LoginResponse>('/auth/login', credentials);

    // Simpan token dan user ke localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return {
      success: true,
      user: response.user,
      token: response.token,
      message: response.message || 'Login successful'
    };
  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message
      };
    }

    return {
      success: false,
      message: 'Terjadi kesalahan yang tidak diketahui'
    };
  }
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect ke login
    window.location.href = '/login';
  }
}

export function getStoredUser(): User | null {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
}

export function getStoredToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

export function isAuthenticated(): boolean {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('token');
  }
  return false;
}
