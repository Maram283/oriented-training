import { z } from 'zod';

export const loginSchema = z.object({
  userName: z.string().min(1, 'userName is required'),
  password: z.string().min(1, 'password is required'),
});