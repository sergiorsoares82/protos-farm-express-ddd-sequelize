import type { NextFunction, Request, Response } from 'express';
import type { ITokenService } from '../../../domain/services/token.interface';
import { JwtTokenService } from '../../../application/services/jwt-token.service';

const tokenService: ITokenService = new JwtTokenService(
  process.env.JWT_SECRET || 'default_secret',
);

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const payload = tokenService.verifyToken(token);

  if (!payload) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }

  // Attach user info to request so controllers can use it
  (req as any).user = payload;
  next();
}
