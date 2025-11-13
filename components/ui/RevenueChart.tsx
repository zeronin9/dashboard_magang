'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', revenue: 5000000, partners: 12 },
  { month: 'Feb', revenue: 7500000, partners: 18 },
  { month: 'Mar', revenue: 9200000, partners: 24 },
  { month: 'Apr', revenue: 11000000, partners: 30 },
  { month: 'May', revenue: 13500000, partners: 38 },
  { month: 'Jun', revenue: 15500000, partners: 45 },
];

export function RevenueChart() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Total Revenue</h3>
        <p className="text-sm text-gray-500 mt-1">Rp 15,500,000 • +12.5% from last month</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="month" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `${value / 1000000}M`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Revenue']}
          />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="#3b82f6" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
      
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-gray-600">Visitors for the last 6 months</span>
        <span className="text-green-600 font-medium">Trending up ↑</span>
      </div>
    </div>
  );
}
