import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    userName: z.string().min(1, 'userName is required'),
    password: z.string().min(1, 'password is required'),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    userName: z.string().min(3, 'userName must be at least 3 characters'),
    password: z.string().min(6, 'password must be at least 6 characters'),
  }),
});

export const verify2FALoginSchema = z.object({
  body: z.object({
    tempToken: z.string().min(1, 'tempToken is required'),
    code: z.string().length(6, 'Code must be exactly 6 digits'),
  }),
});

export const verify2FASetupSchema = z.object({
  body: z.object({
    code: z.string().length(6, 'Code must be exactly 6 digits'),
  }),
});