import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(72),
  name: z.string().min(1).max(120),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const socialLoginSchema = z.object({
  provider: z.string(),
  idToken: z.string().min(1),
});

export const quenMatKhauSchema = z.object({
  email: z.string().email(),
});

export const datLaiMatKhauSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(6).max(72),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(6).max(72),
});
