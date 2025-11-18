import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  let controller: AbortController | null = null;
  let timeoutId: NodeJS.Timeout | null = null;

  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.warn('⚠️ No token provided');
      return NextResponse.json(
        { message: 'Unauthorized - No token provided' },
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('📥 License API - GET /api/license');
    console.log('✅ Token:', token.substring(0, 20) + '...');

    const partnerId = request.headers.get('X-User-Partner-Id');
    const userRole = request.headers.get('X-User-Role');

    console.log('🏢 Partner ID:', partnerId);
    console.log('👥 User Role:', userRole);

    const backendUrl = process.env.BACKEND_URL || 'http://192.168.1.11:3001/api';
    console.log('🔗 Backend URL:', backendUrl);

    let apiEndpoint = '';

    if (!userRole || userRole === 'null' || userRole === 'unknown') {
      console.warn('⚠️ No valid role - using generic endpoint');
      apiEndpoint = `${backendUrl}/license`;
    } else if (userRole.includes('admin_platform')) {
      console.log('✅ Admin platform - fetching all');
      apiEndpoint = `${backendUrl}/license`;
    } else if ((userRole.includes('admin_mitra') || userRole.includes('partner')) && partnerId && partnerId !== 'null') {
      console.log(`✅ Partner - fetching for ${partnerId}`);
      apiEndpoint = `${backendUrl}/license/partner/${partnerId}`;
    } else {
      console.log('⚠️ Fallback - using generic endpoint');
      apiEndpoint = `${backendUrl}/license`;
    }

    console.log('🔗 Final endpoint:', apiEndpoint);

    controller = new AbortController();
    timeoutId = setTimeout(() => {
      console.warn('⏱️ Request timeout');
      controller?.abort();
    }, 10000);

    console.log('🔄 Calling backend...');
    
    const backendResponse = await fetch(apiEndpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    console.log('📥 Backend response:');
    console.log('   Status:', backendResponse.status);
    console.log('   StatusText:', backendResponse.statusText);
    console.log('   Content-Type:', backendResponse.headers.get('content-type'));

    const contentType = backendResponse.headers.get('content-type');
    
    if (!contentType?.includes('application/json')) {
      const responseText = await backendResponse.text();
      console.error('❌ Not JSON! Got:', contentType);
      console.error('❌ Response body:', responseText.substring(0, 500));

      return NextResponse.json(
        {
          message: `Invalid response from backend. Expected JSON, got ${contentType}`,
          details: responseText.substring(0, 200),
        },
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let data;
    try {
      data = await backendResponse.json();
      console.log('✅ JSON parsed. Type:', typeof data, 'Array:', Array.isArray(data));
    } catch (parseErr) {
      console.error('❌ Failed to parse JSON:', parseErr);
      return NextResponse.json(
        { message: 'Failed to parse backend JSON', error: String(parseErr) },
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ⚠️ IMPORTANT: Check HTTP status even if JSON parsing succeeded
    if (!backendResponse.ok) {
      console.error('❌ Backend returned error status:', backendResponse.status);
      console.error('❌ Error data:', data);

      return NextResponse.json(
        {
          message: data.message || `Backend error: ${backendResponse.statusText}`,
          status: backendResponse.status,
          details: data,
        },
        { status: backendResponse.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Success! Items count:', Array.isArray(data) ? data.length : '1 object');
    
    return NextResponse.json(data, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    if (timeoutId) clearTimeout(timeoutId);

    console.error('❌ ERROR:', error);
    console.error('❌ Type:', error instanceof Error ? error.constructor.name : typeof error);
    
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('❌ Request timeout');
      return NextResponse.json(
        { message: 'Backend request timeout (10s)' },
        { status: 504, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return NextResponse.json(
      {
        message: 'Error fetching from backend',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
