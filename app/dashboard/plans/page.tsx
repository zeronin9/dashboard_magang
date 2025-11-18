'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredToken } from '@/lib/auth';
import { formatRupiah } from '@/lib/formatCurrency';
import { Sidebar } from '@/components/ui/Sidebar';
import { SubscriptionPlansTable } from '@/components/ui/SubscriptionPlansTable';
import { Menu, Search, AlertCircle, Package, TrendingUp } from 'lucide-react';

interface SubscriptionPlan {
  plan_id: string;
  plan_name: string;
  price: string;
  branch_limit: number;
  device_limit: number;
  description: string;
  created_at?: string;
}

export default function SubscriptionPlansPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<SubscriptionPlan[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const token = getStoredToken();
    
    if (!token) {
      router.push('/login');
      return;
    }

    fetchPlans(token);
  }, [router]);

  const fetchPlans = async (token: string) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔵 Fetching subscription plans...');

      const response = await fetch('/api/subscription-plan', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log('📥 Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Plans data:', data);
        setPlans(data);
        filterPlans(data, searchQuery);
      } else {
        const errorData = await response.json();
        console.error('❌ Fetch failed:', errorData);
        throw new Error(errorData.message || 'Failed to fetch subscription plans');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch subscription plans';
      console.error('❌ Error:', errorMsg);
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPlans = (data: SubscriptionPlan[], query: string) => {
    if (!query) {
      setFilteredPlans(data);
    } else {
      const filtered = data.filter(p =>
        p.plan_name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPlans(filtered);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterPlans(plans, query);
  };

  const handleRefresh = () => {
    const token = getStoredToken();
    if (token) {
      fetchPlans(token);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading subscription plans...</p>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Plans</h2>
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

  // Calculate average price in Rupiah
  const averagePrice = plans.length > 0
    ? plans.reduce((sum, p) => sum + parseFloat(p.price), 0) / plans.length
    : 0;

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
            <h1 className="ml-4 text-lg font-semibold text-gray-900">Plans</h1>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Subscription Plans</h1>
            <p className="text-gray-600 mt-2">Manage all your subscription packages</p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            {/* Total Plans Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Plans</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{plans.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Active subscription plans</p>
                </div>
                <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="w-7 h-7 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Average Price Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Average Price</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {formatRupiah(averagePrice)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">/month across all plans</p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="bg-white text-black rounded-xl border border-gray-200 p-6 shadow-sm mb-8">
            <div className="space-y-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by plan name or description..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              {/* Results Info */}
              {searchQuery && (
                <p className="text-sm text-gray-600 pt-2 border-t border-gray-200">
                  Found <span className="font-semibold text-gray-900">{filteredPlans.length}</span> result(s)
                </p>
              )}
            </div>
          </div>

          {/* Subscription Plans Table */}
          <SubscriptionPlansTable 
            plans={filteredPlans} 
            onRefresh={handleRefresh}
          />
        </main>
      </div>
    </div>
  );
}
