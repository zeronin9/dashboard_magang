import { LoginForm } from '@/components/LoginForm';
import { ApiConnectionTest } from '@/components/ApiConnectionTest';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Horeka
          </h1>
          <p className="text-gray-600">
            Admin Platform Level 3
          </p>
        </div>

        {/* API Connection Test (Development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6">
            <ApiConnectionTest />
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <LoginForm />
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Butuh bantuan?{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
            Hubungi Support
          </a>
        </p>

        <p className="text-center text-xs text-gray-500 mt-8">
          © 2024 Horeka Dashboard. All rights reserved.
        </p>
      </div>
    </div>
  );
}