import { Schema, model, Types } from 'mongoose';

export interface IFile {
  filename: string;
  s3Key: string;
  uploadedBy: Types.ObjectId;
  mimeType: string;
  size: number;
  uploadedAt: Date;
}

const fileSchema = new Schema<IFile>({
  filename: { type: String, required: true },
  s3Key: { type: String, required: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

export const File = model<IFile>('File', fileSchema);