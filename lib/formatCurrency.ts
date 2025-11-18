/**
 * Format currency to Indonesian Rupiah (IDR)
 * @param value - Numeric value to format
 * @returns Formatted currency string (e.g., "Rp 50.000")
 */
export function formatRupiah(value: number | string): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return 'Rp 0';
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue);
}

/**
 * Format currency without symbol (just numbers with separators)
 * @param value - Numeric value to format
 * @returns Formatted number string (e.g., "50.000")
 */
export function formatNumber(value: number | string): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return '0';
  }

  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue);
}
