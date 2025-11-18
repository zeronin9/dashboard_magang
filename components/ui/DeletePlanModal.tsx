'use client';

import { useState } from 'react';
import { formatRupiah } from '@/lib/formatCurrency';
import { Modal } from './Modal';
import { Loader2, AlertTriangle } from 'lucide-react';

interface SubscriptionPlan {
  plan_id: string;
  plan_name: string;
  price: string;
}

interface DeletePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  plan: SubscriptionPlan | null;
}

export function DeletePlanModal({ isOpen, onClose, onSuccess, plan }: DeletePlanModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!plan) return;

    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/subscription-plan/${plan.plan_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete plan');
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete plan');
      console.error('Delete plan error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!plan) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Plan">
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Delete This Plan?
            </h4>
            <p className="text-gray-600 mb-4">
              You are about to delete the <span className="font-semibold">{plan.plan_name}</span> plan. 
              This action cannot be undone.
            </p>
            <div className="bg-gray-50 rounded-lg p-3 space-y-2 border border-gray-200">
              <div className="text-sm">
                <span className="text-gray-500">Plan Name:</span>
                <span className="ml-2 font-medium text-gray-900">{plan.plan_name}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Price:</span>
                <span className="ml-2 font-medium text-gray-900">{formatRupiah(plan.price)}/bulan</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">ID:</span>
                <span className="ml-2 font-mono text-xs text-gray-700 break-all">{plan.plan_id}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? 'Deleting...' : 'Delete Plan'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
