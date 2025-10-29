import { type Request, type Response } from 'express';
import { client } from '../services/redis.service';
import { RedisKeys, SECONDS_IN_A_DAY } from '../constants';
import { responseHandler } from '../utils/responseHandler';
import { CustomError } from '../utils/customError';
import { authService } from '../services/auth.service';
import { withAsyncTryCatch } from '../utils/withAsyncTryCatch';
import {
    LoginDto,
    RefreshTokenDto,
    ResendOtpDto,
    ResetPasswordDto,
    SignUpDto,
    VerifyOtpDto,
    LogoutDto,
} from '../dtos/auth.dto';

export const signup = withAsyncTryCatch(async (req: Request, res: Response) => {
    const {
        email,
        firstName,
        lastName,
        address,
        companyName,
        country,
        city,
        postalCode,
        importerOrExporter,
        phone,
    }: SignUpDto = req.body;

    const response = await authService.signUp({
        email,
        firstName,
        lastName,
        address,
        companyName,
        country,
        city,
        postalCode,
        importerOrExporter,
        phone,
    });
    if (!response.success) {
        return responseHandler.error(
            res,
            new CustomError('Signup failed', 400),
        );
    }
    return responseHandler.success(
        res,
        201,
        'Signup successful. Password sent to email.',
    );
});

export const login = withAsyncTryCatch(async (req: Request, res: Response) => {
    const { email, password }: LoginDto = req.body;

    const response = await authService.login({ email, password });

    if (!response.success) {
        return responseHandler.error(
            res,
            new CustomError('Invalid credentials', 400),
        );
    }
    return responseHandler.success(
        res,
        200,
        'OTP has been sent to registered email',
    );
});

export const verifyOtpOnLogin = withAsyncTryCatch(
    async (req: Request, res: Response) => {
        const { email, otp }: VerifyOtpDto = req.body;

        const { accessToken, refreshToken, user } = await authService.verifyOtp(
            { email, otp },
        );

        // save the refresh payload in redis
        const expiresIn =
            (process.env.REDIS_REFRESH_EXPIRES_IN as unknown as number) *
            SECONDS_IN_A_DAY;
        await client.set(`${RedisKeys.RefreshToken}:${user.id}`, refreshToken, {
            expiration: { type: 'EX', value: expiresIn },
        });

        // send the refresh token via http-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            maxAge: expiresIn,
        });

        return responseHandler.success(res, 200, 'Login successful', {
            accessToken,
            user,
        });
    },
);

export const resendOtp = withAsyncTryCatch(
    async (req: Request, res: Response) => {
        const { email }: ResendOtpDto = req.body;

        const response = await authService.resendOtp({ email });

        if (response.success) {
            return responseHandler.success(
                res,
                200,
                'OTP has been resent to registered email',
            );
        } else {
            return responseHandler.error(
                res,
                new CustomError('Failed to resend OTP', 400),
            );
        }
    },
);

export const requestPasswordResetLink = withAsyncTryCatch(
    async (req: Request, res: Response) => {
        const { email }: { email: string } = req.body;

        const response = await authService.requestPasswordResetLink({
            email,
        });

        if (response.success) {
            return responseHandler.success(
                res,
                200,
                'Password reset link has been sent to your registered email',
            );
        } else {
            return responseHandler.error(
                res,
                new CustomError('Failed to send password reset link', 400),
            );
        }
    },
);

export const resetPassword = withAsyncTryCatch(
    async (req: Request, res: Response) => {
        const { code, new_password }: ResetPasswordDto = req.body;

        const response = await authService.resetPassword({
            code,
            new_password,
        });

        if (response.success) {
            return responseHandler.success(
                res,
                200,
                'Password reset was successful',
            );
        } else {
            return responseHandler.error(
                res,
                new CustomError('Failed to reset password', 400),
            );
        }
    },
);

export const refresh = withAsyncTryCatch(
    async (req: Request, res: Response) => {
        const { refreshToken }: Pick<RefreshTokenDto, 'refreshToken'> =
            req.cookies;
        const {
            userId,
            email,
            isActive,
        }: Omit<RefreshTokenDto, 'refreshToken'> = req.body;

        if (!refreshToken) {
            return responseHandler.error(
                res,
                new CustomError('Unauthorized', 401),
            );
        }

        const { newAccessToken, newRefreshToken } = await authService.refresh({
            userId,
            email,
            isActive,
            refreshToken,
        });

        // save the refresh payload in redis
        const expiresIn =
            (process.env.REDIS_REFRESH_EXPIRES_IN as unknown as number) *
            SECONDS_IN_A_DAY;
        await client.set(
            `${RedisKeys.RefreshToken}:${userId}`,
            newRefreshToken,
            { expiration: { type: 'EX', value: expiresIn } },
        );

        // send the refresh token via http-only cookie
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            maxAge: expiresIn,
        });

        return responseHandler.success(res, 200, 'Token refreshed', {
            accessToken: newAccessToken,
        });
    },
);

export const logout = withAsyncTryCatch(async (req: Request, res: Response) => {
    const { userId }: LogoutDto = req.body;
    await authService.logout({ userId });

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
    });
    return responseHandler.success(res, 200, 'Logout successful');
});
