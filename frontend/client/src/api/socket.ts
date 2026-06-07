import { io, Socket } from 'socket.io-client';
import { env } from '@/config/env';

// env.apiBaseUrl is typically something like "http://localhost:4000/api"
// We need to connect to the root domain: "http://localhost:4000"
const socketUrl = env.apiBaseUrl.replace('/api', '');

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(socketUrl, {
      withCredentials: true,
      autoConnect: false, // Tự động connect khi cần
    });
  }
  return socket;
};
