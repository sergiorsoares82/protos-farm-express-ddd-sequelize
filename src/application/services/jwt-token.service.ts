// infrastructure/services/JwtTokenService.ts
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import type ms from 'ms';
import { ITokenService } from '../../domain/services/token.interface';

export class JwtTokenService implements ITokenService {
  constructor(
    private secret: Secret,
    private accessTokenExpiresIn: ms.StringValue = '4h' as ms.StringValue,
    private refreshTokenExpiresIn: ms.StringValue = '7d' as ms.StringValue,
  ) {}

  generateAccessToken(payload: object): string {
    const options: SignOptions = { expiresIn: this.accessTokenExpiresIn };
    return jwt.sign(payload, this.secret, options);
  }

  generateRefreshToken(payload: object): string {
    const options: SignOptions = { expiresIn: this.refreshTokenExpiresIn };
    return jwt.sign(payload, this.secret, options);
  }

  verifyToken(token: string): object | null {
    try {
      return jwt.verify(token, this.secret) as object;
    } catch {
      return null;
    }
  }
}
