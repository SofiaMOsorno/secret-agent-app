import { config } from 'dotenv';
import { S3Client } from "@aws-sdk/client-s3";

// Asegurarse de cargar las variables de entorno
config();

// Verificar que las variables necesarias existan
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_BUCKET_NAME) {
    throw new Error('AWS credentials not found in environment variables');
}

export const s3Config = {
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION || 'us-east-1',
    bucket: process.env.AWS_BUCKET_NAME
};

export const s3Client = new S3Client(s3Config);