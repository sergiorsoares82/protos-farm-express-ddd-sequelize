import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../../../infrastructure/repositories/sequelize/models/user.model';

export const requirePermission = (permission: string | string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id.id; // added by authentication middleware
    // console.log('userId', req, userId);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await UserModel.findByPk(userId);
    // console.log('user', user);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const has = await user.hasPermission(permission);
    if (!has) return res.status(403).json({ error: 'Forbidden' });

    next();
  };
};
