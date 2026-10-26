/**
 * Formats a number to Indian currency format e.g. ₹1,24,500 or ₹18,00,000
 */
export function formatIndianCurrency(amount: number): string {
  if (isNaN(amount)) return '₹0';
  
  const isNegative = amount < 0;
  const absAmount = Math.abs(Math.round(amount));
  const s = absAmount.toString();
  
  let result = '';
  if (s.length > 3) {
    const lastThree = s.substring(s.length - 3);
    const otherNumbers = s.substring(0, s.length - 3);
    const withCommas = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    result = withCommas + ',' + lastThree;
  } else {
    result = s;
  }
  
  return (isNegative ? '-₹' : '₹') + result;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Formats ISO or YYYY-MM-DD date into "26 Oct 2026"
 */
export function formatDate(dateInput: string | Date): string {
  if (!dateInput) return '';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '';
  
  const day = d.getDate();
  const month = MONTHS[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Formats time into "2:30 pm"
 */
export function formatTime(dateInput: string | Date): string {
  if (!dateInput) return '';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '';
  
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  return `${hours}:${minutes} ${ampm}`;
}

/**
 * Relative time relative to today (default 26 Oct 2026 as per brief baseline)
 */
export function formatRelativeTime(dateInput: string | Date, baseDateInput?: string | Date): string {
  if (!dateInput) return '';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  // Default reference point is 2026-10-26T16:00:00.000Z or current time if beyond
  const now = baseDateInput 
    ? (typeof baseDateInput === 'string' ? new Date(baseDateInput) : baseDateInput)
    : new Date('2026-10-26T16:00:00.000Z');
  
  const diffMs = now.getTime() - d.getTime();
  if (diffMs < 0) return 'just now';
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 2) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes} mins ago`;
  if (diffHours === 1) return '1 hour ago';
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 30) return `${diffDays} days ago`;
  return formatDate(d);
}

/**
 * Formats phone number into spaced readable format e.g. "+91 98200 12345"
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
}
