import { IRefreshTokenRepository } from '../../../domain/auth/refresh-token.repository';

export class LogoutUseCase {
  constructor(private refreshTokenRepository: IRefreshTokenRepository) {}

  async execute(userId: string) {
    await this.refreshTokenRepository.deleteByUserId(userId);
    return { success: true };
  }
}
