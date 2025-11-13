'use client';

import { useState } from 'react';
import { Mail, Phone, Calendar, Edit, Trash2, Plus } from 'lucide-react';
import { AddPartnerModal } from './AddPartnerModal';
import { EditPartnerModal } from './EditPartnerModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface Partner {
  partner_id: string;
  business_name: string;
  business_email: string;
  business_phone: string;
  status: string;
  joined_date: string;
}

interface PartnersTableProps {
  partners: Partner[];
  onRefresh: () => void;
}

export function PartnersTable({ partners, onRefresh }: PartnersTableProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  const handleEdit = (partner: Partner) => {
    console.log('✏️ Edit partner:', partner);
    setSelectedPartner(partner);
    setIsEditModalOpen(true);
  };

  const handleDelete = (partner: Partner) => {
    console.log('🗑️ Delete partner:', partner);
    setSelectedPartner(partner);
    setIsDeleteModalOpen(true);
  };

  const handleSuccess = () => {
    console.log('✅ Action successful, refreshing...');
    onRefresh();
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Partners Management</h3>
              <p className="text-sm text-gray-500 mt-1">
                Manage your registered business partners ({partners.length} total)
              </p>
            </div>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Partner
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Business Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Joined Date
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {partners.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-gray-400">
                      <p className="text-lg font-medium mb-1">No partners yet</p>
                      <p className="text-sm">Click "Add Partner" to create your first partner</p>
                    </div>
                  </td>
                </tr>
              ) : (
                partners.map((partner) => (
                  <tr key={partner.partner_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {partner.business_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{partner.business_name}</div>
                          <div className="text-sm text-gray-500">ID: {partner.partner_id.slice(0, 8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {partner.business_email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {partner.business_phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        partner.status === 'Active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                          partner.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                        {partner.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(partner.joined_date).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(partner)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit partner"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(partner)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete partner"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {partners.length > 0 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{partners.length}</span> partners
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddPartnerModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleSuccess}
      />

      <EditPartnerModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleSuccess}
        partner={selectedPartner}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={handleSuccess}
        partner={selectedPartner}
      />
    </>
  );
}
