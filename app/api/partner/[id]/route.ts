import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config';

// PUT - Update Partner (/partner/:id)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.error('❌ No authorization token provided');
      return NextResponse.json(
        { 
          success: false,
          message: 'Unauthorized',
          error: 'No authorization token found'
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const partnerId = params.id;
    
    console.log('🔄 [PUT] Updating partner:', partnerId);
    console.log('📤 Request payload:', body);
    
    // Validate required fields
    if (!body.business_name || !body.business_email || !body.business_phone) {
      console.error('❌ Missing required fields');
      return NextResponse.json(
        { 
          success: false,
          message: 'Missing required fields',
          error: 'business_name, business_email, and business_phone are required'
        },
        { status: 400 }
      );
    }

    const url = `${API_CONFIG.BACKEND_URL}/partner/${partnerId}`;
    console.log('🌐 Backend URL:', url);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('📥 Backend Response Status:', response.status);
    console.log('📥 Backend Response Headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('📦 Backend Response Text:', responseText);

    let data;
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      console.error('⚠️ Failed to parse JSON response:', parseError);
      console.error('⚠️ Raw response:', responseText);
      
      if (!response.ok) {
        return NextResponse.json(
          { 
            success: false,
            message: 'Backend error - invalid JSON response',
            error: `Backend returned status ${response.status} with non-JSON response`
          },
          { status: response.status }
        );
      }
      
      data = { message: 'Operation completed but response was not JSON' };
    }

    if (!response.ok) {
      console.error('❌ Backend returned error:', response.status, data);
      return NextResponse.json(
        { 
          success: false,
          message: data.message || 'Failed to update partner',
          error: data.error || `Backend returned status ${response.status}`
        },
        { status: response.status }
      );
    }

    console.log('✅ Update successful:', data);
    
    return NextResponse.json(
      { 
        success: true,
        message: 'Partner updated successfully',
        data: data
      }, 
      { status: 200 }
    );
    
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('❌ Error in PUT /api/partner/[id]:', errorMsg);
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'N/A');
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error while updating partner',
        error: errorMsg
      },
      { status: 500 }
    );
  }
}

// DELETE - Soft Delete Partner (/partner/:id -> status becomes "Suspended")
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.error('❌ No authorization token provided');
      return NextResponse.json(
        { 
          success: false,
          message: 'Unauthorized',
          error: 'No authorization token found'
        },
        { status: 401 }
      );
    }
    
    const partnerId = params.id;
    console.log('🗑️ [DELETE] Suspending partner:', partnerId);

    const url = `${API_CONFIG.BACKEND_URL}/partner/${partnerId}`;
    console.log('🌐 Backend URL:', url);
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 Backend Response Status:', response.status);
    console.log('📥 Backend Response Headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('📦 Backend Response Text:', responseText);

    let data;
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      console.error('⚠️ Failed to parse JSON response:', parseError);
      console.error('⚠️ Raw response:', responseText);
      
      if (!response.ok) {
        return NextResponse.json(
          { 
            success: false,
            message: 'Backend error - invalid JSON response',
            error: `Backend returned status ${response.status} with non-JSON response`
          },
          { status: response.status }
        );
      }
      
      data = { message: 'Operation completed but response was not JSON' };
    }

    if (!response.ok) {
      console.error('❌ Backend returned error:', response.status, data);
      return NextResponse.json(
        { 
          success: false,
          message: data.message || 'Failed to suspend partner',
          error: data.error || `Backend returned status ${response.status}`
        },
        { status: response.status }
      );
    }

    console.log('✅ Soft delete successful (Partner suspended):', data);
    
    return NextResponse.json(
      { 
        success: true,
        message: 'Partner suspended successfully',
        data: data
      }, 
      { status: 200 }
    );
    
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('❌ Error in DELETE /api/partner/[id]:', errorMsg);
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'N/A');
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error while suspending partner',
        error: errorMsg
      },
      { status: 500 }
    );
  }
}