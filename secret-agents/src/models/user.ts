import { Schema, model } from 'mongoose';

export interface IUser {
  email: string;
  codename: string;
  isLeader: boolean;
  isOnline: boolean;
  lastSeen: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  codename: { type: String, required: true, unique: true },
  isLeader: { type: Boolean, default: false },
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now }
});

export const User = model<IUser>('User', userSchema);