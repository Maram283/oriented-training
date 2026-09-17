import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    userName: z.string().min(1, 'userName is required'),
    password: z.string().min(1, 'password is required'),
  }),
  password: z.string()
  .min(6,"password must be at least 6 characters long")
});