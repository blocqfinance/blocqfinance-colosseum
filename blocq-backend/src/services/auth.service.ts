import {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} from './jwt.service';
import User from '../models/user.model';
import sendEmail from './email.service';
import {
    generateOneTimePassword,
    generateRandomPassword,
    isPasswordValid,
} from '../utils/helpers';
import { comparePassword, hashPassword } from '../utils/passwordHashing';
import { client } from './redis.service';
import { OTP_EXPIRATION, RedisKeys } from '../constants';
import {
    type AccessTokenPayload,
    type RefreshTokenPayload,
} from '../interface/types';
import { CustomError } from '../utils/customError';
import {
    LoginDto,
    LogoutDto,
    RefreshTokenDto,
    ResendOtpDto,
    ResetPasswordDto,
    SignUpDto,
    VerifyOtpDto,
} from '../dtos/auth.dto';
import crypto from 'node:crypto';

export const authService = {
    signUp: async (input: SignUpDto) => {
        const existingUser = await User.findOne({ email: input.email });
        if (existingUser)
            throw new CustomError(
                'An account with this email address already exists.',
                409,
            );

        const rawPassword = generateRandomPassword(10);

        const user = new User({ ...input, password: rawPassword });
        await user.save();

        const subject = `BlocqFinance Account Signup`;
        const body = `Hi ${input.firstName}, <br/>Your signup was successful and your Blocq Finance password is ${rawPassword}. <br/>Kindly change your password after login.`;

        await sendEmail(input.email, subject, body);

        return { success: true };
    },

    login: async (input: LoginDto) => {
        const user = await User.findOne({ email: input.email });
        if (!user) throw new CustomError('User not found', 404);

        const isValid = await comparePassword(input.password, user.password);
        if (!isValid) throw new CustomError('Invalid email or password', 400);

        const otp = generateOneTimePassword();
        const hashedOtp = await hashPassword(otp);

        await client.set(
            `${RedisKeys.OneTimePassword}:${input.email}`,
            hashedOtp,
            { expiration: { type: 'EX', value: OTP_EXPIRATION } },
        );

        // Send OTP to user's email
        const subject = 'Blocq Finance OTP';
        const body = `<p>Your one time password is <strong>${otp}</strong></p><p>It will expire in 5 minutes.</p>`;
        await sendEmail(user.email, subject, body);

        return { success: true };
    },

    verifyOtp: async (input: VerifyOtpDto) => {
        // check otp
        const cachedOtp = await client.get(
            `${RedisKeys.OneTimePassword}:${input.email}`,
        );
        if (!cachedOtp) {
            throw new CustomError('OTP expired or invalid', 400);
        }

        const isValidOtp = await comparePassword(
            input.otp as string,
            cachedOtp,
        );
        if (!isValidOtp) {
            throw new CustomError('OTP expired or invalid', 400);
        }

        const user = await User.findOne({ email: input.email });
        if (!user) {
            throw new CustomError('Invalid email or password', 400);
        }

        // delete OTP from cache
        await client.del(`${RedisKeys.OneTimePassword}:${input.email}`);

        const access_payload: AccessTokenPayload = {
            userId: user.id,
            email: user.email,
            isActive: user.isActive,
        };
        const refresh_payload: RefreshTokenPayload = { userId: user.id };

        const accessToken = await signAccessToken(access_payload);
        const refreshToken = await signRefreshToken(refresh_payload);

        return { accessToken, refreshToken, user };
    },

    resendOtp: async (input: ResendOtpDto) => {
        const user = await User.findOne({ email: input.email });
        if (!user) throw new CustomError('Invalid credential', 400);

        const otp = generateOneTimePassword();
        const hashedOtp = await hashPassword(otp);

        await client.set(
            `${RedisKeys.OneTimePassword}:${input.email}`,
            hashedOtp,
            { expiration: { type: 'EX', value: OTP_EXPIRATION } },
        );

        await sendEmail(
            user.email,
            'Blocq Finance OTP',
            `<p>Your one time password is <strong>${otp}</strong></p><p>It will expire in 5 minutes.</p>`,
        );

        return { success: true };
    },

    requestPasswordResetLink: async (input: { email: string }) => {
        const user = await User.findOne({ email: input.email });

        if (!user) {
            throw new CustomError('Check the payload parameter', 400);
        }

        const verificationCode = crypto.randomUUID();

        await client.set(
            `${RedisKeys.VerificationCode}:${verificationCode}`,
            input.email,
            { expiration: { type: 'EX', value: OTP_EXPIRATION } },
        );

        await sendEmail(
            user.email,
            'Blocq Finance Account Password Reset',
            `<p>
                To reset your password, kindly click on this link or copy and paste it into your browser: <br/> 
                <a href="${process.env.FRONTEND_URL}/reset-password?code=${verificationCode}" target="_blank" rel="noopener noreferrer">
                    ${process.env.FRONTEND_URL}/reset-password?code=${verificationCode}
                </a>
            </p>`,
        );

        return { success: true };
    },

    resetPassword: async (input: ResetPasswordDto) => {
        if (!isPasswordValid(input.new_password)) {
            throw new CustomError(
                'Password must be at least 6 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
                400,
            );
        }

        const email = await client.get(
            `${RedisKeys.VerificationCode}:${input.code}`,
        );

        if (!email) {
            throw new CustomError('Invalid verification code', 400);
        }

        const user = await User.findOne({ email });

        if (!user) {
            throw new CustomError('Check the payload parameters', 400);
        }

        const isSamePassword = await comparePassword(
            input.new_password,
            user.password,
        );

        if (isSamePassword) {
            throw new CustomError(
                'Password must be different from current',
                400,
            );
        }

        user.password = input.new_password;
        if (user.isActive === false) {
            user.isActive = true;
        }

        const response = await user.save();

        if (!response) {
            throw new CustomError('Error resetting password');
        }

        // clear session from redis
        await client.del(`${RedisKeys.VerificationCode}:${input.code}`);

        return { success: true };
    },

    refresh: async (input: RefreshTokenDto) => {
        const cachedRefreshToken = await client.get(
            `${RedisKeys.RefreshToken}:${input.userId}`,
        );

        if (!cachedRefreshToken) {
            throw new CustomError('Unauthorized', 401);
        }

        const isValid = verifyRefreshToken(input.refreshToken as string);
        if (!isValid) {
            throw new CustomError('Unauthorized', 401);
        }

        const access_payload: AccessTokenPayload = {
            userId: input.userId,
            email: input.email,
            isActive: input.isActive,
        };
        const refresh_payload: RefreshTokenPayload = { userId: input.userId };

        const newAccessToken = await signAccessToken(access_payload);
        const newRefreshToken = await signRefreshToken(refresh_payload);

        return { newAccessToken, newRefreshToken };
    },

    logout: async (input: LogoutDto) => {
        await client.del(`${RedisKeys.RefreshToken}:${input.userId}`);

        return { success: true };
    },
};
