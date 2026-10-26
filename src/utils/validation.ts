import { z } from 'zod';

export const pinSchema = z.object({
  pin: z.string().length(4, 'PIN must be exactly 4 digits').regex(/^\d+$/, 'PIN must contain only numbers'),
});

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Please enter your email or phone number'),
  password: z.string().min(1, 'Please enter your password'),
});

export const phoneSchema = z.object({
  phone: z.string().min(10, 'Please enter a valid 10-digit mobile number'),
});

export type PinFormData = z.infer<typeof pinSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type PhoneFormData = z.infer<typeof phoneSchema>;

const OBVIOUS_SEQUENCES = [
  '0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999',
  '1234', '2345', '3456', '4567', '5678', '6789',
  '4321', '5432', '6543', '7654', '8765', '9876',
  '0123', '3210', '1212', '1313', '2424', '6969', '1122', '2233', '1004', '2000'
];

/**
 * Checks if a 4-digit PIN is obvious according to Section 4 rules
 */
export function checkObviousPin(pin: string, phone?: string): { isObvious: boolean; message?: string } {
  if (pin.length !== 4) {
    return { isObvious: false };
  }

  // 1. Repeated digit (e.g. 1111, 0000)
  if (/^(\d)\1{3}$/.test(pin)) {
    return { isObvious: true, message: 'Please choose a less obvious PIN' };
  }

  // 2. Known sequential or common obvious patterns
  if (OBVIOUS_SEQUENCES.includes(pin)) {
    return { isObvious: true, message: 'Please choose a less obvious PIN' };
  }

  // 3. Last 4 digits of user's phone number
  if (phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length >= 4 && cleanPhone.endsWith(pin)) {
      return { isObvious: true, message: 'Please choose a less obvious PIN' };
    }
  }

  return { isObvious: false };
}
