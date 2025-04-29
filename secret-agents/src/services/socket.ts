import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { encrypt } from './crypto';
import { User } from '../models/user';
import { Message } from '../models/message';

export function initializeSocket(server: HttpServer) {
  const io = new Server(server);

  io.on('connection', async (socket) => {
    const userId = socket.handshake.auth.userId;
    
    if (userId) {
      // Actualizar estado online
      await User.findByIdAndUpdate(userId, {
        isOnline: true,
        lastSeen: new Date()
      });

      // Unirse a sala personal
      socket.join(userId);

      // Escuchar mensajes nuevos
      socket.on('send_message', async (data) => {
        const encryptedContent = encrypt(data.content);
        
        const message = await Message.create({
          from: userId,
          to: data.to,
          content: encryptedContent,
          type: 'chat'
        });

        // Enviar al destinatario
        io.to(data.to).emit('new_message', message);
      });

      // Manejar desconexión
      socket.on('disconnect', async () => {
        await User.findByIdAndUpdate(userId, {
          isOnline: false,
          lastSeen: new Date()
        });
      });
    }
  });

  return io;
}