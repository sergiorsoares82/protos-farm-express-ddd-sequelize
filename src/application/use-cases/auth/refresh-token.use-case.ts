import type { IRefreshTokenRepository } from '../../../domain/auth/refresh-token.repository';
import type { ITokenService } from '../../../domain/services/token.interface';
import { createHash } from 'crypto';

export class RefreshTokenUseCase {
  constructor(
    private tokenService: ITokenService,
    private refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(refreshToken: string) {
    const payload = this.tokenService.verifyToken(refreshToken) as {
      id: string;
      tokenId: string;
    };
    if (!payload || !payload.tokenId)
      return { success: false, error: 'Invalid refresh token' };

    const tokenHash = createHash('sha256').update(refreshToken).digest('hex');
    const stored = await this.refreshTokenRepository.findByTokenId(
      payload.tokenId,
    );
    if (!stored || stored.token_hash !== tokenHash || stored.isExpired()) {
      return { success: false, error: 'Invalid or expired refresh token' };
    }

    const newAccessToken = this.tokenService.generateAccessToken({
      id: payload.id,
    });
    return { success: true, accessToken: newAccessToken };
  }
}
