// ✅ CHANGED: Use Next.js API route instead of direct backend call
const API_URL = '/api';

console.log('🌐 Using API URL:', API_URL);

interface RequestOptions extends RequestInit {
  token?: string;
}

export class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_URL}${endpoint}`;
  
  console.log('📡 Making request to:', url);
  console.log('📤 Request options:', { method: fetchOptions.method, headers });
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    console.log('📥 Response status:', response.status);

    const data = await response.json();
    console.log('📦 Response data:', data);

    if (!response.ok) {
      throw new ApiError(
        data.message || data.error || 'Terjadi kesalahan',
        response.status
      );
    }

    return data;
  } catch (error) {
    console.error('❌ Request error:', error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError(
        `Tidak dapat terhubung ke server. Pastikan backend berjalan.`,
        0
      );
    }
    
    throw new ApiError(
      'Terjadi kesalahan: ' + (error as Error).message,
      0
    );
  }
}

export const api = {
  get: <T>(endpoint: string, token?: string) =>
    request<T>(endpoint, { method: 'GET', token }),

  post: <T>(endpoint: string, data?: unknown, token?: string) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  put: <T>(endpoint: string, data?: unknown, token?: string) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),

  delete: <T>(endpoint: string, token?: string) =>
    request<T>(endpoint, { method: 'DELETE', token }),
};

export { API_URL };
