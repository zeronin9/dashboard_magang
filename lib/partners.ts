// lib/api/partners.ts

import { api } from '@/lib/api';

export interface Partner {
  id: number;
  business_name: string;
  business_email: string;
  business_phone: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface CreatePartnerData {
  business_name: string;
  business_email: string;
  business_phone: string;
  status?: 'active' | 'inactive';
}

export interface UpdatePartnerData {
  business_name: string;
  business_email: string;
  business_phone: string;
  status: 'active' | 'inactive';
}

// Get all partners
export async function getPartners(token: string): Promise<Partner[]> {
  try {
    const response = await api.get<Partner[]>('/partners', token);
    return response;
  } catch (error) {
    console.error('Error fetching partners:', error);
    throw error;
  }
}

// Get partner by ID
export async function getPartnerById(id: number, token: string): Promise<Partner> {
  try {
    const response = await api.get<Partner>(`/partners/${id}`, token);
    return response;
  } catch (error) {
    console.error(`Error fetching partner ${id}:`, error);
    throw error;
  }
}

// Create partner
export async function createPartner(
  data: CreatePartnerData,
  token: string
): Promise<{ message: string; partner: Partner }> {
  try {
    const response = await api.post<{ message: string; partner: Partner }>(
      '/partners',
      data,
      token
    );
    return response;
  } catch (error) {
    console.error('Error creating partner:', error);
    throw error;
  }
}

// Update partner
export async function updatePartner(
  id: number,
  data: UpdatePartnerData,
  token: string
): Promise<{ message: string; partner: Partner }> {
  try {
    console.log('🔄 Updating partner:', { id, data });
    
    // ✅ Validasi ID sebelum request
    if (!id || isNaN(id)) {
      throw new Error('ID partner tidak valid');
    }

    const response = await api.put<{ message: string; partner: Partner }>(
      `/partners/${id}`,
      data,
      token
    );
    
    console.log('✅ Partner updated successfully:', response);
    return response;
  } catch (error) {
    console.error('❌ Error updating partner:', error);
    throw error;
  }
}

// Delete partner
export async function deletePartner(
  id: number,
  token: string
): Promise<{ message: string }> {
  try {
    console.log('🗑️ Deleting partner:', id);
    
    // ✅ Validasi ID sebelum request
    if (!id || isNaN(id)) {
      throw new Error('ID partner tidak valid');
    }

    const response = await api.delete<{ message: string }>(
      `/partners/${id}`,
      token
    );
    
    console.log('✅ Partner deleted successfully:', response);
    return response;
  } catch (error) {
    console.error('❌ Error deleting partner:', error);
    throw error;
  }
}