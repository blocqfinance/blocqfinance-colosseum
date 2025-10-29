import express from 'express';
const userRouter = express.Router();
import { changePassword, getCurrentUser } from '../controllers/user.controller';
import { authenticate, validate } from '../middlewares/index';

userRouter.get('/me', authenticate, validate.getUserProfile, getCurrentUser);
userRouter.patch(
    '/:userId/change-password',
    authenticate,
    validate.changePassword,
    changePassword,
);

export default userRouter;
