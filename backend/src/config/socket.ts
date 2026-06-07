import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { env } from './env';

let io: SocketIOServer;

export const initSocket = (server: HttpServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: (origin, callback) => {
        // Cho phép request không có origin (Postman, curl)
        if (!origin) return callback(null, true);
        if (env.corsOrigins.includes(origin)) return callback(null, true);
        // Tự động cho phép các tên miền từ Netlify (client & admin)
        if (origin.endsWith('netlify.app')) return callback(null, true);
        return callback(new Error(`CORS blocked: ${origin}`));
      },
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    // Client gọi emit('join_showtime', showtimeId) để vào phòng
    socket.on('join_showtime', (showtimeId: string) => {
      socket.join(`showtime_${showtimeId}`);
    });

    socket.on('leave_showtime', (showtimeId: string) => {
      socket.leave(`showtime_${showtimeId}`);
    });

    socket.on('disconnect', () => {
      // Tự động xóa khỏi các phòng, v.v.
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io is not initialized!');
  }
  return io;
};
