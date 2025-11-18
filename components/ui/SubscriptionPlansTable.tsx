'use client';

import { useState } from 'react';
import { Edit, Trash2, Plus, Zap, Cpu } from 'lucide-react';
import { formatRupiah } from '@/lib/formatCurrency';
import { AddPlanModal } from './AddPlanModal';
import { EditPlanModal } from './EditPlanModal';
import { DeletePlanModal } from './DeletePlanModal';

interface SubscriptionPlan {
  plan_id: string;
  plan_name: string;
  price: string;
  branch_limit: number;
  device_limit: number;
  description: string;
  created_at?: string;
}

interface SubscriptionPlansTableProps {
  plans: SubscriptionPlan[];
  onRefresh: () => void;
}

export function SubscriptionPlansTable({ plans, onRefresh }: SubscriptionPlansTableProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  const handleEdit = (plan: SubscriptionPlan) => {
    console.log('✏️ Edit plan:', plan);
    setSelectedPlan(plan);
    setIsEditModalOpen(true);
  };

  const handleDelete = (plan: SubscriptionPlan) => {
    console.log('🗑️ Delete plan:', plan);
    setSelectedPlan(plan);
    setIsDeleteModalOpen(true);
  };

  const handleSuccess = () => {
    console.log('✅ Action successful, refreshing...');
    onRefresh();
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">All Plans</h3>
            <p className="text-sm text-gray-500 mt-1">({plans.length} total)</p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Plan
          </button>
        </div>

        {/* Table */}
        {plans.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 text-gray-400 mx-auto mb-4 flex items-center justify-center">
              📦
            </div>
            <p className="text-gray-500 text-lg">No subscription plans to display</p>
            <p className="text-gray-400 text-sm mt-1">Create your first plan by clicking "Add Plan"</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Plan Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Limits
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {plans.map((plan) => (
                  <tr key={plan.plan_id} className="hover:bg-gray-50 transition-colors">
                    {/* Plan Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                          {plan.plan_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{plan.plan_name}</div>
                          <div className="text-sm text-gray-500">ID: {plan.plan_id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>

                    {/* Price - UPDATED dengan Rupiah */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">
                          {formatRupiah(plan.price)}
                        </span>
                        <span className="text-xs text-gray-500">/bulan</span>
                      </div>
                    </td>

                    {/* Limits */}
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Zap className="w-4 h-4 text-yellow-600" />
                          <span>{plan.branch_limit} cabang</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Cpu className="w-4 h-4 text-blue-600" />
                          <span>{plan.device_limit} perangkat</span>
                        </div>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 line-clamp-2">{plan.description}</p>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(plan)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit plan"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(plan)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete plan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        {plans.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-sm text-gray-600">
            Showing <span className="font-medium">{plans.length}</span> plan(s)
          </div>
        )}
      </div>

      {/* Modals */}
      <AddPlanModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleSuccess}
      />

      <EditPlanModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleSuccess}
        plan={selectedPlan}
      />

      <DeletePlanModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={handleSuccess}
        plan={selectedPlan}
      />
    </>
  );
}