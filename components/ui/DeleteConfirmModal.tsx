'use client';

import { useState } from 'react';
import { Modal } from './Modal';
import { Loader2, AlertTriangle } from 'lucide-react';

interface Partner {
  partner_id: string;
  business_name: string;
  business_email: string;
}

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  partner: Partner | null;
}

export function DeleteConfirmModal({ isOpen, onClose, onSuccess, partner }: DeleteConfirmModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleDelete = async () => {
    if (!partner) {
      setError('Partner data is missing');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      console.log('📤 Calling DELETE /api/partner/' + partner.partner_id);

      const response = await fetch(`/api/partner/${partner.partner_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        const text = await response.text();
        console.log('📦 Response text:', text);
        responseData = { message: text || 'No response body' };
      }

      console.log('📦 Response data:', responseData);

      if (!response.ok) {
        const errorMessage = responseData.error || 
                           responseData.message || 
                           `Failed to suspend partner (Status: ${response.status})`;
        throw new Error(errorMessage);
      }

      console.log('✅ Partner suspended successfully');
      setSuccessMsg('Partner suspended successfully! Status changed to "Suspended".');
      
      setTimeout(() => {
        onSuccess();
        onClose();
        // Reset state
        setError('');
        setSuccessMsg('');
      }, 1500);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to suspend partner. Please try again.';
      console.error('❌ Delete error:', errorMessage);
      console.error('❌ Full error:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setError('');
      setSuccessMsg('');
      onClose();
    }
  };

  if (!partner) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Suspend Partner">
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            <strong>Error:</strong> {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
            <strong>Success:</strong> {successMsg}
          </div>
        )}

        {!successMsg && (
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Suspend This Partner?
              </h4>
              <p className="text-gray-600 mb-4">
                You are about to suspend <span className="font-semibold">{partner.business_name}</span>. 
                This is a soft delete - the partner's status will be changed to <span className="font-semibold">"Suspended"</span> and they can be reactivated later.
              </p>
              <div className="bg-gray-50 rounded-lg p-3 space-y-2 border border-gray-200">
                <div className="text-sm">
                  <span className="text-gray-500">Business Name:</span>
                  <span className="ml-2 font-medium text-gray-900">{partner.business_name}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Email:</span>
                  <span className="ml-2 font-medium text-gray-900">{partner.business_email}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">ID:</span>
                  <span className="ml-2 font-mono text-xs text-gray-700 break-all">{partner.partner_id}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {!successMsg && (
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? 'Suspending...' : 'Suspend Partner'}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}