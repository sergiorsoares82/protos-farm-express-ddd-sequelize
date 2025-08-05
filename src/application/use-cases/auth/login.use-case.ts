import { UnauthorizedError } from '../../../domain/_shared/errors/unauthorized.error';
import { Uuid } from '../../../domain/_shared/value-objects/uuid.vo';
import { RefreshTokenEntity } from '../../../domain/auth/refresh-token.entity';
import type { IRefreshTokenRepository } from '../../../domain/auth/refresh-token.repository';
import type { IPasswordHasher } from '../../../domain/services/password-hasher.interface';
import type { ITokenService } from '../../../domain/services/token.interface';
import type { IUserRepository } from '../../../domain/user/user.repository';
import type { IUseCase } from '../../_shared/use-case';
import type { LoginInput } from './dto/login-input';
import { LoginOutputMapper, type LoginOutput } from './dto/login-output';
import { createHash } from 'crypto';

export class LoginUseCase implements IUseCase<LoginInput, AuthLoginOutput> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedError();
    }

    const isPasswordValid = await this.passwordHasher.compare(
      input.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedError();
    }

    const payload = {
      id: user.user_id,
      username: user.username,
    };
    const accessToken = this.tokenService.generateAccessToken(payload);

    // Refresh token
    const refreshTokenId = new Uuid();
    const refreshTokenValue = this.tokenService.generateRefreshToken({
      ...payload,
      tokenId: refreshTokenId,
    });
    const tokenHash = createHash('sha256')
      .update(refreshTokenValue)
      .digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.refreshTokenRepository.create(
      new RefreshTokenEntity({
        token_id: refreshTokenId,
        user_id: user.user_id,
        token_hash: tokenHash,
        expires_at: expiresAt,
        created_at: new Date(),
      }),
    );

    return LoginOutputMapper.toOutput(user, accessToken, refreshTokenValue);
  }
}

type AuthLoginOutput = LoginOutput;
