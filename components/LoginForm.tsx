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
    <div className={`flex flex-col gap-6  ${className || ''}`} {...props}>
      <div className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm p-0 border-white" >
        <div className="grid p-0 md:grid-cols-2 ">
          <form className="p-6 md:p-8 " onSubmit={handleSubmit}>
            <div className="space-y-6 ">
              {/* Header */}
              <div className="flex flex-col items-center gap-2 text-center ">
                <h1 className="text-2xl font-bold">Welcome To Horeka Pos+</h1>
                <p className="text-muted-foreground text-balance">
                  POS app to simplify your business operations
                </p>
              </div>

              {/* Error Alert */}
              {apiError && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-500/50">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-red-600 dark:text-red-500 mt-0.5 flex-shrink-0"
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
                    <p className="text-sm text-red-700 dark:text-red-400">{apiError}</p>
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label 
                  htmlFor="email" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="username"
                  placeholder="m@example.com"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  className={`flex h-10 w-full rounded-md border ${
                    errors.username ? 'border-red-500' : 'border-input'
                  } bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50`}
                />
                {errors.username && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.username}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <label 
                    htmlFor="password"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Password
                  </label>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className={`flex h-10 w-full rounded-md border ${
                    errors.password ? 'border-red-500' : 'border-input'
                  } bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50`}
                />
                {errors.password && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                )}
              </div>

              {/* Login Button */}
              <div className="space-y-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
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
                      <span>Loading...</span>
                    </div>
                  ) : (
                    'Login'
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Right side image */}
          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholder.png"
              alt="Login illustration"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}