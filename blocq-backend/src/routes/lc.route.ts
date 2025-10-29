import express from 'express';
const letterOfCreditRouter = express.Router();
import {
    createLC,
    sendSellerOtp,
    verifySellerOtp,
    getLC,
    uploadDocument,
    updateLCStatus,
    getAllLC,
} from '../controllers/letterOfCredit.controller';
import {
    authenticate,
    validate,
    wrappedUploadFunction,
    pdfUpload,
    authenticateSeller,
} from '../middlewares/index';

letterOfCreditRouter.post('/create', authenticate, validate.createLC, createLC);
letterOfCreditRouter.post(
    '/send-seller-otp',
    validate.sendSellerOtp,
    sendSellerOtp,
);
letterOfCreditRouter.post(
    '/verify-seller-otp',
    validate.verifySellerOtp,
    verifySellerOtp,
);
letterOfCreditRouter.get('/', authenticate, getAllLC);
letterOfCreditRouter.get('/:lcId', authenticate, getLC);
letterOfCreditRouter.post(
    '/:lcId/upload-document',
    wrappedUploadFunction,
    validate.verifySellerOnDocumentUpload,
    authenticateSeller,
    pdfUpload,
    uploadDocument,
);
letterOfCreditRouter.post(
    '/:lcId/update-status',
    authenticate,
    validate.updateLCStatus,
    updateLCStatus,
);

export default letterOfCreditRouter;
