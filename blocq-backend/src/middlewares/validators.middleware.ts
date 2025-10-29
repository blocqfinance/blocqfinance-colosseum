import {
    LoginDto,
    ResendOtpDto,
    RequestPasswordResetLinkDto,
    ResetPasswordDto,
    SignUpDto,
    RefreshTokenDto,
    VerifyOtpDto,
    LogoutDto,
} from '../dtos/auth.dto';
import {
    CreateLCDto,
    sendSellerOtpDto,
    UpdateLCDto,
    uploadDocumentDto,
    VerifySellerOtpDto,
} from '../dtos/letterOfCredit.dto';
import { type NextFunction, type Request, type Response } from 'express';
import { validator } from '../utils/validator';
import { ChangePasswordDto, getProfileDto } from '../dtos/user.dto';
import { responseHandler } from '../utils/responseHandler';
import { CustomError } from '../utils/customError';

export const validate = {
    // auth
    login: async (req: Request, res: Response, next: NextFunction) => {
        return validator(req, res, next, LoginDto);
    },
    signUp: async (req: Request, res: Response, next: NextFunction) => {
        return validator(req, res, next, SignUpDto);
    },
    requestPasswordResetLink: async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        return validator(req, res, next, RequestPasswordResetLinkDto);
    },
    resetPassword: async (req: Request, res: Response, next: NextFunction) => {
        return validator(req, res, next, ResetPasswordDto);
    },
    verifyOtpOnLogin: async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        return validator(req, res, next, VerifyOtpDto);
    },
    refresh: async (req: Request, res: Response, next: NextFunction) => {
        return validator(req, res, next, RefreshTokenDto);
    },
    resendOtp: async (req: Request, res: Response, next: NextFunction) => {
        return validator(req, res, next, ResendOtpDto);
    },
    logout: async (req: Request, res: Response, next: NextFunction) => {
        return validator(req, res, next, LogoutDto);
    },
    // letter of credit
    createLC: async (req: Request, res: Response, next: NextFunction) => {
        console.log(req.body.buyer);
        return validator(req, res, next, CreateLCDto);
    },
    sendSellerOtp: async (req: Request, res: Response, next: NextFunction) => {
        return validator(req, res, next, sendSellerOtpDto);
    },
    verifySellerOtp: async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        return validator(req, res, next, VerifySellerOtpDto);
    },
    updateLCStatus: async (req: Request, res: Response, next: NextFunction) => {
        return validator(req, res, next, UpdateLCDto);
    },
    verifySellerOnDocumentUpload: async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        return validator(req, res, next, uploadDocumentDto);
    },
    getUserProfile: async (req: Request, res: Response, next: NextFunction) => {
        return validator(req, res, next, getProfileDto);
    },
    changePassword: async (req: Request, res: Response, next: NextFunction) => {
        const { current_password, new_password } = req.body;

        if (current_password === new_password) {
            return responseHandler.error(
                res,
                new CustomError(
                    'New password must be different from old password',
                    400,
                ),
            );
        }
        return validator(req, res, next, ChangePasswordDto);
    },
};
