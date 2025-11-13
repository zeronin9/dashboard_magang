import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config';  // ← IMPORT

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🔄 Proxying login request to backend...');
    console.log('📤 Request body:', body);
    
    // ✅ GUNAKAN API_CONFIG
    const response = await fetch(`${API_CONFIG.BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('📥 Backend response status:', response.status);
    
    const data = await response.json();
    console.log('📦 Backend response data:', data);
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('❌ Proxy error:', error);
    return NextResponse.json(
      { 
        message: 'Proxy error: ' + (error as Error).message,
        error: 'PROXY_ERROR'
      },
      { status: 500 }
    );
  }
}
