import express from 'express';
const authRouter = express.Router();
import {
    signup,
    login,
    verifyOtpOnLogin,
    resendOtp,
    resetPassword,
    requestPasswordResetLink,
    refresh,
    logout,
} from '../controllers/auth.controller';
import { authenticate, validate } from '../middlewares/index';

authRouter.post('/signup', validate.signUp, signup);
authRouter.post('/login', validate.login, login);
authRouter.post('/verify-login', validate.verifyOtpOnLogin, verifyOtpOnLogin);
authRouter.post('/resend-otp', validate.resendOtp, resendOtp);
authRouter.post('/reset-password', validate.resetPassword, resetPassword);
authRouter.post(
    '/reset-password/request',
    validate.requestPasswordResetLink,
    requestPasswordResetLink,
);
authRouter.post('/refresh', authenticate, validate.refresh, refresh);
authRouter.post('/logout', authenticate, validate.logout, logout);

export default authRouter;
