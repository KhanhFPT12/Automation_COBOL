import { io, type Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || '';

let socket: Socket | null = null;

/**
 * Subscribe to real-time notification events for a given user.
 * Returns an unsubscribe function.
 */
export function subscribeToNotifications(
  userEmail: string,
  onNewNotification: () => void,
): () => void {
  // Avoid duplicate connections
  if (socket?.connected) {
    socket.disconnect();
  }

  socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    withCredentials: true,
  });

  socket.on('connect', () => {
    socket?.emit('join', { userId: userEmail });
  });

  socket.on('notification:new', () => {
    onNewNotification();
  });

  return () => {
    socket?.disconnect();
    socket = null;
  };
}
