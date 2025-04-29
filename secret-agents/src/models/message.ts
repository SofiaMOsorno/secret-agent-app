import { Schema, model, Types } from 'mongoose';

export interface IMessage {
  from: Types.ObjectId;
  to: Types.ObjectId;
  content: string; // Contenido cifrado
  type: 'chat' | 'email';
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>({
  from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['chat', 'email'], required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Message = model<IMessage>('Message', messageSchema);