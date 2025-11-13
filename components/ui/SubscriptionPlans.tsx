'use client';

interface SubscriptionPlan {
  plan_id: string;
  plan_name: string;
  price: string;
  branch_limit: number;
  device_limit: number;
  description: string;
}

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[];
}

export function SubscriptionPlans({ plans }: SubscriptionPlansProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Subscription Plans</h3>
        <p className="text-sm text-gray-500 mt-1">Available packages for partners</p>
      </div>
      <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div 
            key={plan.plan_id} 
            className="rounded-lg border border-gray-200 p-6 hover:border-blue-500 hover:shadow-md transition-all"
          >
            <h4 className="text-lg font-semibold text-gray-900 mb-2">{plan.plan_name}</h4>
            <div className="text-3xl font-bold text-blue-600 mb-4">
              Rp {parseInt(plan.price).toLocaleString('id-ID')}
            </div>
            <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{plan.branch_limit} Branches</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{plan.device_limit} Devices</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
