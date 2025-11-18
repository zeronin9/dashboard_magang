// src/controllers/partner.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Update partner by partner_id (UUID string)
export const updatePartner = async (req, res) => {
  const { id } = req.params; // partner_id dari URL
  const { business_name, business_email, business_phone, status } = req.body;

  try {
    console.log('🔄 [UPDATE] Partner ID:', id);
    console.log('📤 [UPDATE] Request body:', { business_name, business_email, business_phone, status });

    // ✅ Validasi input
    if (!business_name || !business_email || !business_phone) {
      return res.status(400).json({
        success: false,
        message: 'Semua field wajib diisi',
        error: 'Missing required fields'
      });
    }

    // ✅ Cek apakah partner exists
    const existingPartner = await prisma.partner.findUnique({
      where: { partner_id: id }
    });

    if (!existingPartner) {
      console.error('❌ Partner not found:', id);
      return res.status(404).json({
        success: false,
        message: `Partner dengan ID ${id} tidak ditemukan`,
        error: 'Partner not found'
      });
    }

    console.log('✅ Partner found:', existingPartner.business_name);

    // ✅ Validasi email unik (jika diubah)
    if (business_email !== existingPartner.business_email) {
      const emailExists = await prisma.partner.findFirst({
        where: {
          business_email,
          partner_id: { not: id }
        }
      });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email bisnis sudah digunakan partner lain',
          error: 'Email already exists'
        });
      }
    }

    // ✅ Update partner
    const updatedPartner = await prisma.partner.update({
      where: { partner_id: id },
      data: {
        business_name: business_name.trim(),
        business_email: business_email.trim().toLowerCase(),
        business_phone: business_phone.trim(),
        status: status || existingPartner.status,
        updated_at: new Date()
      }
    });

    console.log('✅ Partner updated successfully:', updatedPartner);

    res.status(200).json({
      success: true,
      message: 'Partner berhasil diperbarui',
      partner: updatedPartner
    });

  } catch (error) {
    console.error('❌ Update error:', error);
    
    // Handle Prisma errors
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Partner tidak ditemukan',
        error: 'Record not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui partner',
      error: error.message
    });
  }
};

// Delete (Soft Delete) partner - Change status to "Suspended"
export const deletePartner = async (req, res) => {
  const { id } = req.params;

  try {
    console.log('🗑️ [DELETE] Partner ID:', id);

    // ✅ Cek apakah partner exists
    const existingPartner = await prisma.partner.findUnique({
      where: { partner_id: id }
    });

    if (!existingPartner) {
      console.error('❌ Partner not found:', id);
      return res.status(404).json({
        success: false,
        message: `Partner dengan ID ${id} tidak ditemukan`,
        error: 'Partner not found'
      });
    }

    console.log('✅ Partner found:', existingPartner.business_name);

    // ✅ Soft Delete - Update status to "Suspended"
    const updatedPartner = await prisma.partner.update({
      where: { partner_id: id },
      data: {
        status: 'Suspended',
        updated_at: new Date()
      }
    });

    console.log('✅ Partner suspended successfully:', updatedPartner);

    res.status(200).json({
      success: true,
      message: 'Partner berhasil disuspend',
      partner: updatedPartner
    });

  } catch (error) {
    console.error('❌ Delete error:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Partner tidak ditemukan',
        error: 'Record not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus partner',
      error: error.message
    });
  }
};

// Get partner by ID
export const getPartnerById = async (req, res) => {
  const { id } = req.params;

  try {
    const partner = await prisma.partner.findUnique({
      where: { partner_id: id }
    });

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: `Partner dengan ID ${id} tidak ditemukan`,
        error: 'Partner not found'
      });
    }

    res.status(200).json({
      success: true,
      partner
    });

  } catch (error) {
    console.error('❌ Get partner error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data partner',
      error: error.message
    });
  }
};