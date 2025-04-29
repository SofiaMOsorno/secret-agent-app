import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  salt?: string;
  codename: string;
  isLeader: boolean;
  isOnline: boolean;
  lastSeen: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  codename: { type: String, required: true, unique: true },
  isLeader: { type: Boolean, default: false },
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now }
});

export const User = model<IUser>('User', userSchema);