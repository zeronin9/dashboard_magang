import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config';  // ← IMPORT

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    // ✅ GUNAKAN API_CONFIG
    const response = await fetch(`${API_CONFIG.BACKEND_URL}/partner`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Partner API error:', error);
    return NextResponse.json(
      { message: 'Error fetching partners' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    const body = await request.json();
    
    // ✅ GUNAKAN API_CONFIG
    const response = await fetch(`${API_CONFIG.BACKEND_URL}/partner`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Partner API error:', error);
    return NextResponse.json(
      { message: 'Error creating partner' },
      { status: 500 }
    );
  }
}
