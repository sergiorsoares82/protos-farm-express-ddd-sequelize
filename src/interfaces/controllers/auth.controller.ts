import type { Request, Response } from 'express';
import type { LoginUseCase } from '../../application/use-cases/auth/login.use-case';
import type { RefreshTokenUseCase } from '../../application/use-cases/auth/refresh-token.use-case';
import type { LogoutUseCase } from '../../application/use-cases/auth/logout.use-case';

export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  login = async (req: Request, res: Response) => {
    const login = await this.loginUseCase.execute(req.body);
    return res.status(200).json(login);
  };

  refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const result = await this.refreshTokenUseCase.execute(refreshToken);
    if (!result.success) {
      return res.status(401).json({ error: result.error });
    }
    return res.status(200).json({
      accessToken: result.accessToken,
    });
  };

  // register = async (req: Request, res: Response) => {};
}
