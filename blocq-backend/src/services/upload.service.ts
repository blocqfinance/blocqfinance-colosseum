import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { DocumentRequired } from '../enums/enums';
import { Request, Response, NextFunction } from 'express';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export const uploadService = {
    uploadPDF: async (buffer: Buffer, requiredDoc: string, lcId: string) => {
        return new Promise<UploadApiResponse>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'raw',
                    folder: `blocq/documents`,
                    public_id: `${requiredDoc}/${lcId}`,
                    format: 'pdf',
                    overwrite: true,
                    invalidate: true,
                },
                (error, result) => {
                    if (error) return reject(error);
                    if (result) {
                        resolve(result);
                    } else {
                        reject(new Error('Upload failed without an error'));
                    }
                },
            );
            stream.end(buffer);
        });
    },
};
