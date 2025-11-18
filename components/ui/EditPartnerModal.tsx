'use client';

import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Loader2 } from 'lucide-react';

interface Partner {
  partner_id: string;
  business_name: string;
  business_email: string;
  business_phone: string;
  status: string;
  joined_date: string;
}

interface EditPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  partner: Partner | null;
}

export function EditPartnerModal({ isOpen, onClose, onSuccess, partner }: EditPartnerModalProps) {
  // V V V PERBAIKAN DI SINI V V V
  const [formData, setFormData] = useState({
    business_name: '',
    business_email: '',
    business_phone: '',
    status: '', // <-- 1. TAMBAHKAN 'status' DI SINI
  });
  // ^ ^ ^ PERBAIKAN DI SINI ^ ^ ^
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (partner && isOpen) {
      // V V V PERBAIKAN DI SINI V V V
      setFormData({
        business_name: partner.business_name || '',
        business_email: partner.business_email || '',
        business_phone: partner.business_phone || '',
        status: partner.status || '', // <-- 2. ISI 'status' DARI PARTNER
      });
      // ^ ^ ^ PERBAIKAN DI SINI ^ ^ ^
      setError('');
      setSuccessMsg('');
    }
  }, [partner, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      console.log('📤 Submitting form data:', formData); // Ini sekarang akan menyertakan 'status'
      console.log('📤 Partner ID:', partner.partner_id);

      const response = await fetch(`/api/partner/${partner.partner_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // <-- 3. Kirim formData LENGKAP
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
                           `Failed to update partner (Status: ${response.status})`;
        throw new Error(errorMessage);
      }

      console.log('✅ Partner updated successfully');
      setSuccessMsg('Partner updated successfully!');
      
      setTimeout(() => {
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          business_name: '',
          business_email: '',
          business_phone: '',
          status: '', // <-- 4. Reset 'status' juga
        });
      }, 1000);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update partner. Please try again.';
      console.error('❌ Update error:', errorMessage);
      console.error('❌ Full error:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!partner) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Partner">
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Partner ID:</p>
          <p className="text-sm font-mono text-gray-700 break-all">{partner.partner_id}</p>
          <p className="text-xs text-gray-500 mt-2">
            Status: <span className={`font-semibold ${partner.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
              {partner.status}
            </span>
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Name *
          </label>
          <input
            type="text"
            name="business_name"
            required
            value={formData.business_name}
            onChange={handleChange}
            className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Enter business name"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Email *
          </label>
          <input
            type="email"
            name="business_email"
            required
            value={formData.business_email}
            onChange={handleChange}
            className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="business@example.com"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Phone *
          </label>
          <input
            type="tel"
            name="business_phone"
            required
            value={formData.business_phone}
            onChange={handleChange}
            className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="08xxxxxxxxxx"
            disabled={isLoading}
          />
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={isLoading || successMsg !== ''}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? 'Updating...' : 'Update Partner'}
          </button>
        </div>
      </form>
    </Modal>
  );
}