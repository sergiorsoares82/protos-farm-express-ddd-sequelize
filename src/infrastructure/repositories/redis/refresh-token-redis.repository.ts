import { RedisClientType } from 'redis';
import { RefreshTokenEntity } from '../../../domain/auth/refresh-token.entity';
import { IRefreshTokenRepository } from '../../../domain/auth/refresh-token.repository';
import { Uuid } from '../../../domain/_shared/value-objects/uuid.vo';

export class RedisRefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly redis: RedisClientType) {}

  async create(token: RefreshTokenEntity): Promise<void> {
    const key = `refresh_token:${token.token_id.id}`;
    await this.redis.set(key, token.token_hash, {
      EXAT: Math.floor(token.expires_at.getTime() / 1000),
    });
  }

  async findByTokenId(tokenId: string): Promise<RefreshTokenEntity | null> {
    const key = `refresh_token:${tokenId}`;
    const tokenHash = await this.redis.get(key);
    if (!tokenHash) {
      return null;
    }
    return new RefreshTokenEntity({
      user_id: new Uuid(), // User ID is not stored in Redis
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default expiration, adjust as needed
      token_id: new Uuid(tokenId),
      token_hash: tokenHash,
    });
  }

  async delete(tokenId: string): Promise<void> {
    await this.redis.del(`refresh_token:${tokenId}`);
  }

  async deleteByUserId(userId: string): Promise<void> {
    const keys = await this.redis.keys(`refresh_token:*`);
    const tokenKeys = keys.filter((key) => key.includes(`user_id:${userId}`));
    if (tokenKeys.length > 0) {
      await this.redis.del(tokenKeys);
    }
  }
}
