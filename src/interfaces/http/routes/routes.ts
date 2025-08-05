import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import authRouter from './auth.routes';
import userRouter from './user.routes';

const router = express.Router();

router.use('/users', authMiddleware, userRouter);
router.use('/auth', authRouter);

export default router;
