'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredToken } from '@/lib/auth';
import { Sidebar } from '@/components/ui/Sidebar';
import { StatCard } from '@/components/ui/StatCard';
import { PartnersTable } from '@/components/ui/PartnersTable';
import { SubscriptionPlans } from '@/components/ui/SubscriptionPlans';
import { 
  Users, 
  CheckCircle, 
  Package,
  Menu,
  AlertCircle
} from 'lucide-react';

interface Partner {
  partner_id: string;
  business_name: string;
  business_email: string;
  business_phone: string;
  status: string;
  joined_date: string;
}

interface SubscriptionPlan {
  plan_id: string;
  plan_name: string;
  price: string;
  branch_limit: number;
  device_limit: number;
  description: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalPartners: 0,
    activePartners: 0,
    totalPlans: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getStoredToken();
    
    if (!token) {
      router.push('/login');
      return;
    }

    fetchDashboardData(token);
  }, [router]);

  const fetchDashboardData = async (token: string) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔵 Fetching dashboard data...');

      // Fetch Partners
      const partnersRes = await fetch('/api/partner', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('📥 Partners response status:', partnersRes.status);

      if (partnersRes.ok) {
        const partnersData = await partnersRes.json();
        console.log('✅ Partners data:', partnersData);
        setPartners(partnersData);
        
        const activeCount = partnersData.filter((p: Partner) => p.status === 'Active').length;
        setStats(prev => ({
          ...prev,
          totalPartners: partnersData.length,
          activePartners: activeCount,
        }));
      } else {
        const errorData = await partnersRes.json();
        console.error('❌ Partners fetch failed:', errorData);
        throw new Error(errorData.message || 'Failed to fetch partners');
      }

      // Fetch Subscription Plans
      const plansRes = await fetch('/api/subscription-plan', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('📥 Plans response status:', plansRes.status);

      if (plansRes.ok) {
        const plansData = await plansRes.json();
        console.log('✅ Plans data:', plansData);
        setPlans(plansData);
        setStats(prev => ({
          ...prev,
          totalPlans: plansData.length,
        }));
      } else {
        const errorData = await plansRes.json();
        console.error('❌ Plans fetch failed:', errorData);
      }

    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Dashboard</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => router.push('/login')}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 h-16 flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="ml-4 text-lg font-semibold text-gray-900">Dashboard</h1>
          </div>
        </div>

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Dashboard Overview
            </h2>
            <p className="text-gray-600 mt-1">
              Monitor your platform performance and manage partners
            </p>
          </div>

          {/* Stats Grid - ONLY 3 CARDS */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <StatCard
              title="Total Partners"
              value={stats.totalPartners}
              description="Registered partners"
              trend={{ value: "+12.5%", isPositive: true }}
              icon={Users}
              iconColor="text-blue-600"
            />
            
            <StatCard
              title="Active Partners"
              value={stats.activePartners}
              description="Active subscriptions"
              trend={{ value: "+8.3%", isPositive: true }}
              icon={CheckCircle}
              iconColor="text-green-600"
            />
            
            <StatCard
              title="Plans Available"
              value={stats.totalPlans}
              description="Subscription packages"
              icon={Package}
              iconColor="text-purple-600"
            />
          </div>

          <div className="mb-8">
            <SubscriptionPlans plans={plans} />
          </div>

          {/* Partners Table */}
<PartnersTable 
  partners={partners} 
  onRefresh={() => fetchDashboardData(getStoredToken()!)}
/>

        </main>
      </div>
    </div>
  );
}
