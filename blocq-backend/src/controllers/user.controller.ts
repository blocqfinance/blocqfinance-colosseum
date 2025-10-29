import { ChangePasswordDto } from '../dtos/user.dto';
import { userService } from '../services/user.service';
import { CustomError } from '../utils/customError';
import { responseHandler } from '../utils/responseHandler';
import { withAsyncTryCatch } from '../utils/withAsyncTryCatch';
import { Request, Response } from 'express';

export const getCurrentUser = withAsyncTryCatch(
    async (req: Request, res: Response) => {
        const { userId } = req.body;

        const response = await userService.profile({ userId });

        if (!response) {
            return responseHandler.error(
                res,
                new CustomError('User not found', 404),
            );
        }

        return responseHandler.success(res, 200, 'User profile', response);
    },
);

export const changePassword = withAsyncTryCatch(
    async (req: Request, res: Response) => {
        const { userId } = req.params as Pick<ChangePasswordDto, 'userId'>;
        const {
            current_password,
            new_password,
        }: Omit<ChangePasswordDto, 'userId'> = req.body;

        const response = await userService.changePassword({
            userId,
            current_password,
            new_password,
        });

        if (!response) {
            return responseHandler.error(
                res,
                new CustomError('Failed to update password', 400),
            );
        }
        return responseHandler.success(
            res,
            200,
            'Password updated successful',
            response,
        );
    },
);
