import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { redisClient } from '../../infrastructure/cache/redis';

const ACCESS_TOKEN_EXP = '15m';
const REFRESH_TOKEN_EXP = 60 * 60 * 24 * 7; // 7 days

export async function generateTokens(userId: string) {
  const jti = uuidv4();
  const accessToken = jwt.sign({ sub: userId }, process.env.JWT_SECRET!, {
    expiresIn: ACCESS_TOKEN_EXP,
  });
  const refreshToken = uuidv4();

  // Store refresh token in Redis with expiry
  await redisClient.setex(`refresh:${jti}`, REFRESH_TOKEN_EXP, refreshToken);

  return { accessToken, refreshToken, jti };
}

export async function rotateRefreshToken(jti: string, oldToken: string) {
  const stored = await redisClient.get(`refresh:${jti}`);
  if (!stored || stored !== oldToken) throw new Error('Invalid refresh token');

  // Generate new refresh token
  const newToken = uuidv4();
  await redisClient.setex(`refresh:${jti}`, REFRESH_TOKEN_EXP, newToken);
  return newToken;
}

export async function revokeToken(jti: string) {
  await redisClient.del(`refresh:${jti}`);
}
