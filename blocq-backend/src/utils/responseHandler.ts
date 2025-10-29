import { type Response } from 'express';
import { CustomError } from './customError';

export const responseHandler = {
    success: (
        res: Response,
        statusCode = 200,
        message: string,
        data: null | unknown = null,
    ) => {
        const response: Record<string, any> = {
            status: 'success',
            statusCode: statusCode,
            message,
        };
        if (
            typeof data === 'object' &&
            data !== null &&
            'pagination' in data &&
            'data' in data
        ) {
            response.data = data.data;
            response.pagination = data.pagination;
        } else {
            response.data = data;
        }
        res.status(statusCode).json(response);
    },

    error: (res: Response, error: CustomError) => {
        res.status(error.statusCode).json({
            status: 'error',
            statusCode: error.statusCode,
            error: error.message || 'Internal Server Error',
        });
    },
};
