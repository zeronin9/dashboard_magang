'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredToken } from '@/lib/auth';
import { Sidebar } from '@/components/ui/Sidebar';
import { PartnersTable } from '@/components/ui/PartnersTable';
import { Menu, Search, AlertCircle, Users, CheckCircle, UserX } from 'lucide-react';

interface Partner {
  partner_id: string;
  business_name: string;
  business_email: string;
  business_phone: string;
  status: string;
  joined_date: string;
}

export default function PartnersPage() {
  const router = useRouter();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended'>('all');

  useEffect(() => {
    const token = getStoredToken();
    
    if (!token) {
      router.push('/login');
      return;
    }

    fetchPartners(token);
  }, [router]);

  const fetchPartners = async (token: string) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔵 Fetching partners...');

      const response = await fetch('/api/partner', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log('📥 Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Partners data:', data);
        setPartners(data);
        filterPartners(data, searchQuery, filterStatus);
      } else {
        const errorData = await response.json();
        console.error('❌ Fetch failed:', errorData);
        throw new Error(errorData.message || 'Failed to fetch partners');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch partners';
      console.error('❌ Error:', errorMsg);
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPartners = (data: Partner[], query: string, status: string) => {
    let result = data;

    // Filter by search query
    if (query) {
      result = result.filter(p =>
        p.business_name.toLowerCase().includes(query.toLowerCase()) ||
        p.business_email.toLowerCase().includes(query.toLowerCase()) ||
        p.business_phone.includes(query)
      );
    }

    // Filter by status
    if (status !== 'all') {
      const statusMap = {
        active: 'Active',
        suspended: 'Suspended'
      };
      result = result.filter(p => p.status === statusMap[status as keyof typeof statusMap]);
    }

    setFilteredPartners(result);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterPartners(partners, query, filterStatus);
  };

  const handleFilterStatus = (status: 'all' | 'active' | 'suspended') => {
    setFilterStatus(status);
    filterPartners(partners, searchQuery, status);
  };

  const handleRefresh = () => {
    const token = getStoredToken();
    if (token) {
      fetchPartners(token);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading partners...</p>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Partners</h2>
          <p className="text-gray-600 mb-6">{error}</p>
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

  const totalPartners = partners.length;
  const activePartners = partners.filter(p => p.status === 'Active').length;
  const suspendedPartners = partners.filter(p => p.status === 'Suspended').length;

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
            <h1 className="ml-4 text-lg font-semibold text-gray-900">Partners</h1>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Partners Management</h1>
            <p className="text-gray-600 mt-2">Manage all your business partners in one place</p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            {/* Total Partners Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Partners</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalPartners}</p>
                  <p className="text-xs text-gray-500 mt-1">All registered partners</p>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Active Partners Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Active Partners</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{activePartners}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {totalPartners > 0 ? Math.round((activePartners / totalPartners) * 100) : 0}% of total
                  </p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </div>

            {/* Suspended Partners Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Suspended Partners</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">{suspendedPartners}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {totalPartners > 0 ? Math.round((suspendedPartners / totalPartners) * 100) : 0}% of total
                  </p>
                </div>
                <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center">
                  <UserX className="w-7 h-7 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-8">
            <div className="space-y-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by business name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              {/* Filter Status Buttons */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleFilterStatus('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterStatus === 'all'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All ({totalPartners})
                </button>
                <button
                  onClick={() => handleFilterStatus('active')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterStatus === 'active'
                      ? 'bg-green-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Active ({activePartners})
                </button>
                <button
                  onClick={() => handleFilterStatus('suspended')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterStatus === 'suspended'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Suspended ({suspendedPartners})
                </button>
              </div>

              {/* Results Info */}
              {searchQuery && (
                <p className="text-sm text-gray-600 pt-2 border-t border-gray-200">
                  Found <span className="font-semibold text-gray-900">{filteredPartners.length}</span> result(s) for "{searchQuery}"
                </p>
              )}
            </div>
          </div>

          {/* Partners Table */}
          <PartnersTable 
            partners={filteredPartners} 
            onRefresh={handleRefresh}
          />
        </main>
      </div>
    </div>
  );
}
