import { validate, ValidationError } from 'class-validator';
import { type ClassConstructor, plainToClass } from 'class-transformer';
import { responseHandler } from './responseHandler';
import { type NextFunction, type Request, type Response } from 'express';
import { CustomError } from './customError';

export const validator = async <T extends object>(
    req: Request,
    res: Response,
    next: NextFunction,
    dto: ClassConstructor<T>,
) => {
    let reqObj = req.body;
    reqObj = {
        ...reqObj,
        ...req.params,
    };
    if (!reqObj) {
        return responseHandler.error(
            res,
            new CustomError('Payload required', 400),
        );
    }
    if (req.path === '/refresh' && req.method === 'POST') {
        const { refreshToken } = req.cookies;
        Object.assign(reqObj, { refreshToken });
    }
    const objectToValidate = plainToClass(dto, reqObj);
    const errors: ValidationError[] = await validate(objectToValidate);
    if (errors.length) {
        const constraints = errors[0]?.constraints as Record<string, string>;
        const message = Object.values(constraints)[0] as string;
        return responseHandler.error(res, new CustomError(message, 400));
    }
    next();
};
