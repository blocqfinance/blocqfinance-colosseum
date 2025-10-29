import { type Request, type Response } from 'express';
import { responseHandler } from '../utils/responseHandler';
import { CustomError } from '../utils/customError';
import { withAsyncTryCatch } from '../utils/withAsyncTryCatch';
import {
    CreateLCDto,
    sendSellerOtpDto,
    UpdateLCDto,
    VerifySellerOtpDto,
} from '../dtos/letterOfCredit.dto';
import { letterOfCreditService } from '../services/letterOfCredit.service';
import { DocumentRequired, LCStatus, LCUpdateTrigger } from '../enums/enums';
import { paginate } from '../utils/helpers';
import { ILetterOfCredit } from '../models/letterOfCredit.model';

export const createLC = withAsyncTryCatch(
    async (req: Request, res: Response) => {
        const {
            buyer,
            sellerEmail,
            sellerCompany,
            amount,
            currency,
            goodsDescription,
            shippingDeadline,
            requiredDocument,
        }: CreateLCDto = req.body;

        const response = await letterOfCreditService.createLC({
            buyer,
            sellerEmail,
            sellerCompany,
            amount,
            currency,
            goodsDescription,
            shippingDeadline,
            requiredDocument,
        });

        if (!response) {
            return responseHandler.error(
                res,
                new CustomError('Failed to create letter of credit', 400),
            );
        }

        return responseHandler.success(
            res,
            201,
            'Letter of credit created',
            response,
        );
    },
);

export const sendSellerOtp = withAsyncTryCatch(
    async (req: Request, res: Response) => {
        const { email }: sendSellerOtpDto = req.body;

        const response = await letterOfCreditService.sendSellerOTP({ email });

        if (response.success) {
            return responseHandler.success(
                res,
                200,
                'OTP has been resent to your email',
            );
        } else {
            return responseHandler.error(
                res,
                new CustomError('Failed to resend OTP', 400),
            );
        }
    },
);

export const verifySellerOtp = withAsyncTryCatch(
    async (req: Request, res: Response) => {
        const { email, otp }: VerifySellerOtpDto = req.body;

        const response = await letterOfCreditService.verifySellerOTP({
            email,
            otp,
        });

        if (!response.success) {
            return responseHandler.error(
                res,
                new CustomError('Invalid OTP', 400),
            );
        }
        return responseHandler.success(
            res,
            200,
            'OTP verified. Proceed with on-chain seller registration.',
        );
    },
);

export const getAllLC = withAsyncTryCatch(
    async (req: Request, res: Response) => {
        const {
            page,
            limit,
            status,
        }: {
            page?: string;
            limit?: string;
            status?: LCStatus;
        } = req.query;

        const { data, count } = await letterOfCreditService.getAllLC({
            page,
            limit,
            status,
        });

        if (data.length === 0) {
            return responseHandler.success(
                res,
                200,
                'No letter of credits found',
                data,
            );
        }

        return responseHandler.success(
            res,
            200,
            'All letter of credits found',
            paginate<ILetterOfCredit>(data, count, page, limit),
        );
    },
);

export const getLC = withAsyncTryCatch(async (req: Request, res: Response) => {
    const { lcId } = req.params;

    const response = await letterOfCreditService.getLC(lcId as string);

    if (!response) {
        return responseHandler.error(
            res,
            new CustomError('Letter of credit not found', 404),
        );
    }

    return responseHandler.success(
        res,
        200,
        'Letter of credit found',
        response,
    );
});

export const uploadDocument = withAsyncTryCatch(
    async (req: Request, res: Response) => {
        const { lcId } = req.params;
        const {
            documentUrl,
            requiredDocument,
        }: {
            documentUrl: string;
            requiredDocument: DocumentRequired;
        } = req.body;

        const input: UpdateLCDto = {
            lcId: lcId as string,
            trigger: LCUpdateTrigger.DocumentUpload,
            documentUrl,
            requiredDocument,
            status: LCStatus.DocumentSubmitted,
            action: 'Upload Document',
            actor: 'seller',
            message: 'Document has been uploaded',
        };

        const response = await letterOfCreditService.updateLCStatus(input);

        if (!response) {
            return responseHandler.error(
                res,
                new CustomError('Letter of credit not found', 404),
            );
        }

        return responseHandler.success(
            res,
            200,
            'Letter of credit has been updated',
            {
                lc: response,
            },
        );
    },
);

export const updateLCStatus = withAsyncTryCatch(
    async (req: Request, res: Response) => {
        const { lcId } = req.params as Pick<UpdateLCDto, 'lcId'>;

        const {
            trigger,
            buyerWalletAddress,
            sellerWalletAddress,
            // documentUrl,
            termsAcceptedBySeller,
        } = req.body;

        const input: UpdateLCDto = {
            lcId: lcId as string,
            trigger,
        };

        switch (trigger) {
            case LCUpdateTrigger.FundLC:
                input.buyerWalletAddress = buyerWalletAddress;
                input.status = LCStatus.AwaitingSeller;
                input.action = 'Fund LC';
                input.actor = 'buyer';
                input.message = 'Letter of credit has been funded';
                break;
            case LCUpdateTrigger.SellerRegistered:
                input.sellerWalletAddress = sellerWalletAddress;
                input.termsAcceptedBySeller = termsAcceptedBySeller;
                input.status = LCStatus.Active;
                input.action = 'Register Seller';
                input.actor = 'seller';
                input.message = 'Seller has been registered';
                break;
            // case LCUpdateTrigger.DocumentUpload:
            //     input.documentUrl = documentUrl;
            //     input.status = LCStatus.DocumentSubmitted;
            //     input.action = 'Upload Document';
            //     input.actor = 'seller';
            //     input.message = 'Document has been uploaded';
            //     break;
            default:
                return responseHandler.error(
                    res,
                    new CustomError('Invalid trigger', 400),
                );
        }

        const response = await letterOfCreditService.updateLCStatus(input);

        if (!response) {
            return responseHandler.error(
                res,
                new CustomError('Letter of credit not found', 404),
            );
        }

        return responseHandler.success(
            res,
            200,
            'Letter of credit has been updated',
            response,
        );
    },
);
