// import { HttpError } from "../types";
import { type Request, type Response } from 'express';
import { CustomError } from '../utils/customError';
import Multer, { FileFilterCallback } from 'multer';
export const errorHandler = (err: unknown, req: Request, res: Response) => {
    const statusCode = (err as CustomError).statusCode || 500;
    const message =
        (err as CustomError).message || 'An unexpected error occurred';

    console.error(`Status Code: ${statusCode} - Error: ${message}`);

    res.status(statusCode).json({
        statusCode,
        error: message,
        stack:
            process.env.ENV === 'development'
                ? (err as CustomError).stack
                : undefined,
    });
};
