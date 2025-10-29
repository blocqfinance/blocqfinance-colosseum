import Multer, { FileFilterCallback } from 'multer';
import { type Request, type Response, type NextFunction } from 'express';
import { uploadService } from '../services/upload.service';
import letterOfCredit from '../models/letterOfCredit.model';
import { CustomError } from '../utils/customError';
import { responseHandler } from '../utils/responseHandler';

const storage = Multer.memoryStorage();

const upload = Multer({
    storage,
    limits: {
        fileSize: 1 * 1024 * 1024, // no larger than 1MB
    },
    fileFilter: (
        _: Request,
        file: Express.Multer.File,
        cb: FileFilterCallback,
    ) => {
        const allowedTypes = ['application/pdf'];
        if (!allowedTypes.includes(file.mimetype)) {
            cb(new Error('Only PDF files are allowed'));
        }
        cb(null, true);
    },
});

export const wrappedUploadFunction = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    upload.single('document')(req, res, (err) => {
        if (!req.file) {
            return responseHandler.error(
                res,
                new CustomError('No file uploaded', 400),
            );
        }
        if (err) {
            return responseHandler.error(
                res,
                new CustomError(err.message, 400),
            );
        }
        next();
    });
};

export const pdfUpload = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { lcId } = req.params;
    const resp = await letterOfCredit
        .findOne({ lcId })
        .select('requiredDocument');

    if (!resp) {
        return res.status(404).json({ error: 'Letter of credit not found' });
    }

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }
    const buffer = req.file.buffer;
    const result = await uploadService.uploadPDF(
        buffer,
        resp.requiredDocument,
        lcId as string,
    );
    req.body.documentUrl = result.secure_url;

    next();
};
