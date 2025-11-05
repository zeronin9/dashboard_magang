'use client';

import { useState } from 'react';
import { Button } from './ui/Button';

export function ApiConnectionTest() {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const testConnection = async () => {
    setStatus('testing');
    setMessage('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'test',
          password: 'test'
        })
      });

      if (response.ok || response.status === 401) {
        // 401 artinya server merespons (credential salah tapi server aktif)
        setStatus('success');
        setMessage(`✅ Koneksi berhasil! Server merespons dengan status ${response.status}`);
      } else {
        setStatus('error');
        setMessage(`⚠️ Server merespons dengan status ${response.status}`);
      }
    } catch (error) {
      setStatus('error');
      setMessage(`❌ Tidak dapat terhubung ke server: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-medium mb-3">Test API Connection</h3>
      <p className="text-sm text-gray-600 mb-3">
        API URL: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}
      </p>
      <Button
        onClick={testConnection}
        variant="outline"
        size="sm"
        isLoading={status === 'testing'}
      >
        Test Koneksi
      </Button>
      {message && (
        <p className={`mt-3 text-sm ${
          status === 'success' ? 'text-green-600' : 'text-red-600'
        }`}>
          {message}
        </p>
      )}
    </div>
  );
}