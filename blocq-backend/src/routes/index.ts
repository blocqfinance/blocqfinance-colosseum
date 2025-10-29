import express from 'express';
import authRouter from './auth.route';
import letterOfCreditRouter from './lc.route';
import userRouter from './user.route';
import publicRouter from './public.route';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/lc', letterOfCreditRouter);
router.use('/users', userRouter);
router.use('/public', publicRouter);

export default router;
