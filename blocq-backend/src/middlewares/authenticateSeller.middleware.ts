import { NextFunction, Request, Response } from 'express';
import {
    uploadDocumentDto,
    VerifySellerOtpDto,
} from '../dtos/letterOfCredit.dto';
import { letterOfCreditService } from '../services/letterOfCredit.service';
import { CustomError } from '../utils/customError';
import { withAsyncTryCatch } from '../utils/withAsyncTryCatch';

export const authenticateSeller = withAsyncTryCatch(
    async (req: Request, res: Response, next: NextFunction) => {
        console.log(req.body);
        const { email, otp }: uploadDocumentDto = req.body;

        const response = await letterOfCreditService.verifySellerOTP({
            email,
            otp,
        });

        if (!response.success) {
            throw new CustomError('Unauthorized', 401);
        }

        next();
    },
);
