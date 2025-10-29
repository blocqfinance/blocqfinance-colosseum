import { type Request, type Response, type NextFunction } from 'express';
import { verifyAccessToken } from '../services/jwt.service';
import { type AccessTokenPayload } from '../interface/types';
import { CustomError } from '../utils/customError';
import { withAsyncTryCatch } from '../utils/withAsyncTryCatch';

export const authenticate = withAsyncTryCatch(
    async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(' ')[1] as string;

        if (!token) {
            console.log('token');
            throw new CustomError('Unauthorized', 401);
        }
        const data = await verifyAccessToken<AccessTokenPayload>(token);
        if (req.body === undefined) {
            req.body = {};
        }
        req.body.userId = data.userId;
        req.body.email = data.email;

        next();
    },
);
