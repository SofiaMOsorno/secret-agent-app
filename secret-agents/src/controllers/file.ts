import { Request, Response } from 'express';
import { FileService } from '../services/file';
import { FileWithKey } from '../types/multer';

const fileService = new FileService();

export class FileController {
  async uploadFile(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const file = await fileService.saveFile(
        req.file as FileWithKey,
        req.session.userId
      );

      res.json({
        success: true,
        fileId: file._id,
        filename: file.filename
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Upload failed' });
    }
  }

  async getUserFiles(req: Request, res: Response) {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const files = await fileService.getFilesByUser(req.session.userId);
      res.json({ files });
    } catch (error) {
      console.error('Error getting files:', error);
      res.status(500).json({ error: 'Failed to get files' });
    }
  }

  async deleteFile(req: Request, res: Response) {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      await fileService.deleteFile(req.params.fileId, req.session.userId);
      res.json({ success: true });
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({ error: 'Delete failed' });
    }
  }
}