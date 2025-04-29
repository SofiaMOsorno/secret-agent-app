import { File, IFile } from '../models/file';
import { Upload } from '@aws-sdk/lib-storage';
import { s3Client } from '../config/s3';
import { Request } from 'express';
import { FileWithKey } from '../types/multer';

export class FileService {
  async saveFile(file: FileWithKey, userId: string): Promise<IFile> {
    try {
      const fileDoc = await File.create({
        filename: file.originalname,
        s3Key: file.key,
        uploadedBy: userId,
        mimeType: file.mimetype,
        size: file.size
      });

      return fileDoc;
    } catch (error) {
      console.error('Error saving file to database:', error);
      throw error;
    }
  }

  async getFilesByUser(userId: string): Promise<IFile[]> {
    try {
      const files = await File.find({ uploadedBy: userId })
        .sort({ uploadedAt: -1 })
        .limit(10);
      return files;
    } catch (error) {
      console.error('Error getting files:', error);
      throw error;
    }
  }

  async deleteFile(fileId: string, userId: string): Promise<void> {
    try {
      const file = await File.findOne({ _id: fileId, uploadedBy: userId });
      if (!file) {
        throw new Error('File not found');
      }

      // Delete from S3
      await s3Client.send({
        Bucket: process.env.BUCKET || '',
        Key: file.s3Key,
        Delete: {}
      });

      // Delete from database
      await File.deleteOne({ _id: fileId });
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
}