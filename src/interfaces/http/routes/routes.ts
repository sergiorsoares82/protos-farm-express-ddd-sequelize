import express from 'express';
import userRouter from './user.routes';
import authRouter from './auth.routes';
import { authMiddleware } from '../middlewares/auth-middleware';

const router = express.Router();

router.use('/users', authMiddleware, userRouter);
router.use('/auth', authRouter);

export default router;
