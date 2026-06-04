import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '@/config/env';

import { Role } from '@prisma/client';

export interface JwtPayload {
  sub: string; // user id
  role: Role;
}

export const signAccessToken = (payload: JwtPayload) =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  } as SignOptions);

export const signRefreshToken = (payload: JwtPayload) =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as SignOptions);

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload & { iat: number; exp: number };

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload & { iat: number; exp: number };

export const signResetToken = (payload: { sub: string }) =>
  jwt.sign(payload, env.JWT_RESET_SECRET ?? env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_RESET_EXPIRES_IN,
  } as SignOptions);

export const verifyResetToken = (token: string) =>
  jwt.verify(token, env.JWT_RESET_SECRET ?? env.JWT_ACCESS_SECRET) as { sub: string; iat: number; exp: number };

/**
 * Parse "7d", "15m", "1h" sang số ms để tính thời điểm hết hạn cho DB.
 */
export const parseDuration = (s: string): number => {
  const m = /^(\d+)([smhd])$/.exec(s);
  if (!m) return 0;
  const n = Number(m[1]);
  switch (m[2]) {
    case 's':
      return n * 1000;
    case 'm':
      return n * 60 * 1000;
    case 'h':
      return n * 60 * 60 * 1000;
    case 'd':
      return n * 24 * 60 * 60 * 1000;
    default:
      return 0;
  }
};
