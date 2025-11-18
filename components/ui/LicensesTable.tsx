'use client';

import { useState } from 'react';
import { Calendar, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { formatRupiah } from '@/lib/formatCurrency';

interface License {
  license_id: string;
  activation_code: string;
  partner_id: string;
  branch_id?: string | null;
  device_id?: string | null;
  device_name?: string | null;
  license_status: string;
  partner_name?: string;
  plan_id?: string;
  plan_name?: string;
  price?: string;
  expiry_date?: string;
  created_at?: string;
}

interface LicensesTableProps {
  licenses: License[];
  onRefresh: () => void;
  isAdminPlatform?: boolean;
}

export function LicensesTable({ licenses, onRefresh, isAdminPlatform = false }: LicensesTableProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Active') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </span>
      );
    } else if (status === 'Pending') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
          Pending
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
          <AlertCircle className="w-3 h-3 mr-1" />
          {status}
        </span>
      );
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">All Licenses</h3>
          <p className="text-sm text-gray-500 mt-1">({licenses.length} total)</p>
        </div>
      </div>

      {/* Table */}
      {licenses.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-12 h-12 text-gray-400 mx-auto mb-4 flex items-center justify-center text-2xl">
            🔑
          </div>
          <p className="text-gray-500 text-lg">No licenses to display</p>
          <p className="text-gray-400 text-sm mt-2">
            {isAdminPlatform
              ? 'No licenses available'
              : 'Your mitra doesn\'t have any licenses yet'
            }
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Activation Code
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Device
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Branch
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {licenses.map((license) => (
                <tr key={license.license_id} className="hover:bg-gray-50 transition-colors">
                  {/* Activation Code */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 font-mono text-sm">
                          {license.activation_code}
                        </div>
                        <div className="text-xs text-gray-500">ID: {license.license_id.slice(0, 8)}...</div>
                      </div>
                      <button
                        onClick={() => handleCopyCode(license.activation_code)}
                        className="p-1.5 text-gray-400 hover:bg-gray-100 rounded transition-colors"
                        title="Copy activation code"
                      >
                        <Copy className={`w-4 h-4 ${copiedCode === license.activation_code ? 'text-green-600' : ''}`} />
                      </button>
                    </div>
                  </td>

                  {/* Device */}
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {license.device_name ? (
                        <>
                          <div className="font-medium text-gray-900">{license.device_name}</div>
                          <div className="text-gray-500 font-mono text-xs">{license.device_id}</div>
                        </>
                      ) : (
                        <div className="text-gray-400 italic">Not assigned</div>
                      )}
                    </div>
                  </td>

                  {/* Branch */}
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {license.branch_id ? (
                        <div className="font-medium text-gray-900 font-mono">{license.branch_id.slice(0, 12)}...</div>
                      ) : (
                        <div className="text-gray-400 italic">No branch</div>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    {getStatusBadge(license.license_status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      {licenses.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-sm text-gray-600">
          Showing <span className="font-medium">{licenses.length}</span> license(s)
        </div>
      )}
    </div>
  );
}
