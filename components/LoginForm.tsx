'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';
import { validateUsername, validatePassword } from '@/lib/utils';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
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

    setIsLoading(true);
    try {
      const response = await login({ username, password });
      
      if (response.success) {
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
    <div className={`flex flex-col gap-6 ${className || ''}`} {...props}>
      <div className="overflow-hidden rounded-3xl bg-white shadow-2xl max-w-5xl mx-auto w-full">
        <div className="grid md:grid-cols-2">
          {/* Left side - Login Form */}
          <div className="p-12 md:p-16 flex flex-col justify-center bg-white">
            {/* Logo */}
            <div className="mb-8">
              <div className="flex items-center gap-2">
                <img src="/logo-horeka.svg" alt="Horeka Logo" className="h-10 w-10 object-contain" />
                <span className="text-xl font-bold text-gray-800">Horeka POS+</span>
              </div>
            </div>

            <div className="space-y-8">
              {/* Header */}
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-pink-500 mb-3 leading-relaxed">
                  Start Your Horeka
                </h1>

                <p className="text-gray-500 text-sm">
                  Enter your account:
                </p>
              </div>

              {/* Error Alert */}
              {apiError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200">
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

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username Field */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>

                  </div>
                  <input
                    id="username"
                    type="text"
                    placeholder="Username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 placeholder-gray-400 ${
                      errors.username ? 'ring-2 ring-red-500' : ''
                    }`}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-600 mt-2 ml-1">{errors.username}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 placeholder-gray-400 ${
                      errors.password ? 'ring-2 ring-red-500' : ''
                    }`}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600 mt-2 ml-1">{errors.password}</p>
                  )}
                </div>

                {/* Sign In Button - CHANGED TO PINK */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-2"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    'LOGIN'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right side - Decorative Panel with PURPLE Gradient */}
          <div className="relative hidden md:flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-700 via-purple-600 to-purple-700 p-12">
            {/* Decorative geometric shapes - Purple tones */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-300/20 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-400/30 rounded-full blur-3xl transform -translate-x-40 translate-y-40"></div>
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
            
            {/* Content */}
            <div className="relative z-10 text-center text-white space-y-8">
              <div className="space-y-4">
                <h2 className="text-5xl font-bold">
                  Welcome to Horeka POS+
                </h2>
                <p className="text-white/90 text-lg max-w-sm mx-auto leading-relaxed">
                  POS app to simplify your business operations
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
