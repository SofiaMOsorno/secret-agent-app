import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import multerS3 from "multer-s3";
import { s3Client, s3Config } from "../config/s3";

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    // Lista de tipos MIME permitidos
    const allowedMimes = [
        'text/plain',
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif'
    ];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'));
    }
};

const storage = multerS3({
    s3: s3Client,
    bucket: s3Config.bucket,
    metadata: function (req: Request, file: Express.Multer.File, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req: Request, file: Express.Multer.File, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

export const fileUpload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Límite de 5MB
    }
});