import { type NextFunction, type Request, type Response } from 'express';
import { CustomError } from './customError';
import { responseHandler } from './responseHandler';

export const withAsyncTryCatch = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (err) {
            const error = err as CustomError;
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            return responseHandler.error(res, error);
        }
    };
};
