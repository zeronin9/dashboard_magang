'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredToken } from '@/lib/auth';
import { Sidebar } from '@/components/ui/Sidebar';
import { LicensesTable } from '@/components/ui/LicensesTable';
import { Menu, Search, AlertCircle, Key, CheckCircle } from 'lucide-react';

interface License {
  license_id: string;
  activation_code: string;
  partner_id: string;
  branch_id?: string | null;
  device_id?: string | null;
  device_name?: string | null;
  license_status: string;
  partner_name?: string;
  plan_id?: string;
  plan_name?: string;
  price?: string;
  expiry_date?: string;
  created_at?: string;
}

interface User {
  user_id: string;
  email: string;
  role: string;
  partner_id?: string;
}

export default function LicensesPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [filteredLicenses, setFilteredLicenses] = useState<License[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending'>('all');

  useEffect(() => {
    console.log('🔵 Component mounted');
    
    const token = getStoredToken();
    console.log('🔑 Token from getStoredToken():', token ? 'EXISTS' : 'MISSING');
    
    if (!token) {
      console.warn('❌ No token found, redirecting to login');
      router.push('/login');
      return;
    }

    // Get current user info
    const userStr = localStorage.getItem('user');
    console.log('👤 localStorage.user:', userStr);
    
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        console.log('✅ User parsed:', userData);
      } catch (e) {
        console.error('❌ Error parsing user:', e);
      }
    } else {
      console.warn('⚠️ No user in localStorage');
    }

    fetchLicenses(token);
  }, [router]);

  const fetchLicenses = async (token: string) => {
    try {
      console.log('\n🔵 ===== FETCH LICENSES START =====');
      setIsLoading(true);
      setError(null);

      // Get partner_id dan role
      const partnerId = user?.partner_id || localStorage.getItem('partner_id') || '';
      const userRole = user?.role || localStorage.getItem('role') || '';

      console.log('📋 Headers to send:');
      console.log('   Authorization: Bearer [' + token.substring(0, 20) + '...]');
      console.log('   X-User-Partner-Id: [' + partnerId + ']');
      console.log('   X-User-Role: [' + userRole + ']');

      const response = await fetch('/api/license', {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'X-User-Partner-Id': partnerId || 'null',
          'X-User-Role': userRole || 'unknown',
        }
      });

      console.log('📥 Response received:');
      console.log('   Status:', response.status);
      console.log('   StatusText:', response.statusText);
      console.log('   Content-Type:', response.headers.get('content-type'));

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        console.error('❌ Response is not JSON! Content-Type:', contentType);
        
        // Try to read response text
        const responseText = await response.text();
        console.error('❌ Response body:', responseText.substring(0, 500));
        
        throw new Error(
          `Invalid response type: ${contentType}. Expected application/json. Response: ${responseText.substring(0, 100)}`
        );
      }

      let data;
      try {
        data = await response.json();
        console.log('✅ JSON parsed. Data type:', typeof data, 'Is array:', Array.isArray(data));
        console.log('✅ Data:', data);
      } catch (parseErr) {
        console.error('❌ Failed to parse JSON:', parseErr);
        throw parseErr;
      }

      if (!response.ok) {
        console.error('❌ Response not OK:', data);
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const licensesData = Array.isArray(data) ? data : [];
      console.log('✅ Success! Licenses count:', licensesData.length);
      console.log('✅ First license:', licensesData[0]);

      setLicenses(licensesData);
      filterLicenses(licensesData, searchQuery, filterStatus);
      
      console.log('🔵 ===== FETCH LICENSES END (SUCCESS) =====\n');
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch licenses';
      console.error('❌ CATCH ERROR:', errorMsg);
      console.error('❌ Full error:', err);
      console.log('🔵 ===== FETCH LICENSES END (ERROR) =====\n');
      
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const filterLicenses = (data: License[], query: string, status: string) => {
    let result = data;

    if (query) {
      result = result.filter(l =>
        l.activation_code?.toLowerCase().includes(query.toLowerCase()) ||
        l.license_id?.toLowerCase().includes(query.toLowerCase()) ||
        (l.partner_name && l.partner_name.toLowerCase().includes(query.toLowerCase())) ||
        (l.device_name && l.device_name.toLowerCase().includes(query.toLowerCase()))
      );
    }

    if (status !== 'all') {
      const statusMap: { [key: string]: string } = {
        'active': 'Active',
        'pending': 'Pending',
      };
      result = result.filter(l => l.license_status === statusMap[status]);
    }

    setFilteredLicenses(result);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterLicenses(licenses, query, filterStatus);
  };

  const handleFilterStatus = (status: 'all' | 'active' | 'pending') => {
    setFilterStatus(status);
    filterLicenses(licenses, searchQuery, status);
  };

  const handleRefresh = () => {
    const token = getStoredToken();
    if (token) {
      console.log('🔄 Refreshing...');
      fetchLicenses(token);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading licenses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Licenses</h2>
          <p className="text-gray-600 mb-2 text-sm font-mono break-words">{error}</p>
          <p className="text-gray-500 text-xs mb-6">Check browser console (F12) for more details</p>
          <div className="space-y-3">
            <button
              onClick={handleRefresh}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalLicenses = licenses.length;
  const activeLicenses = licenses.filter(l => l.license_status === 'Active').length;
  const pendingLicenses = licenses.filter(l => l.license_status === 'Pending').length;
  const isAdminPlatform = user?.role === 'admin_platform';

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 h-16 flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="ml-4 text-lg font-semibold text-gray-900">Licenses</h1>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-4xl font-bold text-gray-900">Licenses Management</h1>
              {!isAdminPlatform && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                  Partner View
                </span>
              )}
            </div>
            <p className="text-gray-600 mt-2">
              {isAdminPlatform 
                ? 'Manage all your software licenses and activations'
                : 'View your software licenses and activations'
              }
            </p>
          </div>

          {/* Info Banner for Partners */}
          {!isAdminPlatform && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
              <p className="text-sm text-blue-700">
                <strong>ℹ️ Info:</strong> Anda hanya dapat melihat licenses yang terdaftar untuk mitra Anda. 
                Untuk menambah licenses baru, hubungi platform administrator.
              </p>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {/* Total Licenses Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Licenses</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalLicenses}</p>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Key className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Active Licenses Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Active Licenses</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{activeLicenses}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {totalLicenses > 0 ? Math.round((activeLicenses / totalLicenses) * 100) : 0}% of total
                  </p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </div>

            {/* Pending Licenses Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Pending Licenses</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingLicenses}</p>
                  <p className="text-xs text-gray-500 mt-1">Awaiting activation</p>
                </div>
                <div className="w-14 h-14 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-7 h-7 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-8">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by activation code, device name, or license ID..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleFilterStatus('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterStatus === 'all'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All ({totalLicenses})
                </button>
                <button
                  onClick={() => handleFilterStatus('active')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterStatus === 'active'
                      ? 'bg-green-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Active ({activeLicenses})
                </button>
                <button
                  onClick={() => handleFilterStatus('pending')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterStatus === 'pending'
                      ? 'bg-yellow-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Pending ({pendingLicenses})
                </button>
              </div>

              {searchQuery && (
                <p className="text-sm text-gray-600 pt-2 border-t border-gray-200">
                  Found <span className="font-semibold text-gray-900">{filteredLicenses.length}</span> result(s)
                </p>
              )}
            </div>
          </div>

          {/* Licenses Table */}
          {licenses.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
              <Key className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium">No Licenses Yet</p>
              <p className="text-gray-400 mt-2">No licenses available</p>
            </div>
          ) : (
            <LicensesTable 
              licenses={filteredLicenses} 
              onRefresh={handleRefresh}
              isAdminPlatform={isAdminPlatform}
            />
          )}
        </main>
      </div>
    </div>
  );
}
