import { S3Client } from "@aws-sdk/client-s3";
import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import multerS3 from "multer-s3";

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.ACCESS!,
        secretAccessKey: process.env.SECRET!,
    }
})

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    cb(null, true);
}


const storage = multerS3({
    s3,
    bucket: process.env.BUCKET!,
    metadata: function (req: Request, file: Express.Multer.File, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req: Request, file: Express.Multer.File, cb) {
        cb(null, Date.now().toString());
    }
})

export const fileUpload = multer({
    storage,
    fileFilter
})