import { z } from 'zod';

export const pinSchema = z.object({
  pin: z.string().length(4, 'PIN must be exactly 4 digits').regex(/^\d+$/, 'PIN must contain only numbers'),
});

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Please enter your email or phone number'),
  password: z.string().min(1, 'Please enter your password'),
});

export type PinFormData = z.infer<typeof pinSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
