'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { login } from '@/lib/auth';
import { validateUsername, validatePassword } from '@/lib/utils';

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError('');

    // Validasi
    const newErrors: { username?: string; password?: string } = {};
    
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
      newErrors.username = usernameValidation.message;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit ke API
    setIsLoading(true);
    try {
      const response = await login({ username, password });
      
      if (response.success) {
        // Redirect ke dashboard
        router.push('/dashboard');
        router.refresh();
      } else {
        setApiError(response.message || 'Login gagal');
      }
    } catch (error) {
      console.error('Login error:', error);
      setApiError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {apiError && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-red-700">{apiError}</p>
          </div>
        </div>
      )}

      <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
        <p className="text-sm font-medium text-blue-900 mb-2">
          🔐 Kredensial Admin Platform
        </p>
        <div className="space-y-1">
          <p className="text-xs text-blue-700">
            <span className="font-medium">Username:</span> admin_platform
          </p>
          <p className="text-xs text-blue-700">
            <span className="font-medium">Password:</span> admin123
          </p>
        </div>
        <p className="text-xs text-blue-600 mt-2 italic">
          Role: Platform Super Admin (Level 3)
        </p>
      </div>

      <Input
        label="Username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={errors.username}
        placeholder="admin_platform"
        autoComplete="username"
        disabled={isLoading}
      />

      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        placeholder="Masukkan password"
        autoComplete="current-password"
        disabled={isLoading}
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            disabled={isLoading}
          />
          <span className="ml-2 text-sm text-gray-600">Ingat saya</span>
        </label>
        <a
          href="#"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          Lupa password?
        </a>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        className="w-full"
      >
        {isLoading ? 'Memproses...' : 'Masuk ke Dashboard'}
      </Button>

      <div className="text-center pt-2">
        <p className="text-xs text-gray-500">
          API Endpoint: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}
        </p>
      </div>
    </form>
  );
}