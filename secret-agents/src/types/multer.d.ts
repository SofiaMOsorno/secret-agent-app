import { Express } from 'express';

export interface FileWithKey extends Express.Multer.File {
  key: string;
  location: string;
}