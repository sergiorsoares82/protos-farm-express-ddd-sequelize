import { RefreshTokenEntity } from './refresh-token.entity';

export interface IRefreshTokenRepository {
  create(token: RefreshTokenEntity): Promise<void>;
  findByTokenId(tokenId: string): Promise<RefreshTokenEntity | null>;
  delete(tokenId: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>; // for logout-all
}
