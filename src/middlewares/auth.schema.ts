import { z } from 'zod';

export const loginSchema = z.object({
  userName: z.string().min(1, 'userName is required'),
  password: z.string().min(1, 'password is required'),
});

export const registerSchema = z.object({
  userName: z.string().min(3, 'userName must be at least 3 characters'),
  password: z.string().min(6, 'password must be at least 6 characters'),
});