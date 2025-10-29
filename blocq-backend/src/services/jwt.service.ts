import jwt, {
    TokenExpiredError,
    type Secret,
    type SignOptions,
    type VerifyOptions,
} from 'jsonwebtoken';
import { type StringValue } from 'ms';
import {
    type AccessTokenPayload,
    type RefreshTokenPayload,
} from '../interface/types';
import { CustomError } from '../utils/customError';

const access_secret = process.env.JWT_ACCESS_SECRET as Secret;
const access_expiresIn: number | StringValue = (
    process.env.JWT_ACCESS_EXPIRES_IN ? process.env.JWT_ACCESS_EXPIRES_IN : '1d'
) as StringValue;

const refresh_secret = process.env.JWT_REFRESH_SECRET as Secret;
const refresh_expiresIn: number | StringValue = (
    process.env.JWT_REFRESH_EXPIRES_IN
        ? process.env.JWT_REFRESH_EXPIRES_IN
        : '7d'
) as StringValue;

export const signAccessToken = (
    payload: AccessTokenPayload,
    options?: SignOptions,
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const signOptions: SignOptions = {
            ...options,
            expiresIn: access_expiresIn,
        };
        jwt.sign(payload, access_secret, signOptions, (err, token) => {
            if (err || !token) {
                return reject(err || new Error('Token could not be generated'));
            }
            resolve(token);
        });
    });
};

export const signRefreshToken = (
    payload: RefreshTokenPayload,
    options?: SignOptions,
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const signOptions: SignOptions = {
            ...options,
            expiresIn: refresh_expiresIn,
        };
        jwt.sign(payload, refresh_secret, signOptions, (err, refresh_token) => {
            if (err || !refresh_token) {
                return reject(
                    err || new Error('Refresh token could not be generated'),
                );
            }
            resolve(refresh_token);
        });
    });
};

export const verifyAccessToken = <T extends object>(
    token: string,
    options?: VerifyOptions,
): Promise<T> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, access_secret, options, (err, decoded) => {
            if (err || !decoded) {
                if (err instanceof TokenExpiredError) {
                    return reject(new CustomError('Token expired', 401));
                }
                return reject(err || new Error('Token could not be verified'));
            }
            resolve(decoded as T);
        });
    });
};

export const verifyRefreshToken = <T extends object>(
    token: string,
    options?: VerifyOptions,
): Promise<T> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, refresh_secret, options, (err, decoded) => {
            if (err || !decoded) {
                if (err instanceof TokenExpiredError) {
                    return reject(new CustomError('Token expired', 401));
                }
                return reject(err || new Error('Token could not be verified'));
            }
            resolve(decoded as T);
        });
    });
};
