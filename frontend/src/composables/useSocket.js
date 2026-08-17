import { io } from 'socket.io-client';
import { useAuthStore } from '@/stores/auth';
import { useChatStore } from '@/stores/chat';
import { useNotificationStore } from '@/stores/notification';
import { useToast } from '@/composables/useToast';

let socket = null;

export function useSocket() {
  const authStore = useAuthStore();
  const chatStore = useChatStore();
  const notificationStore = useNotificationStore();
  const { showToast } = useToast();

  const initSocketConnection = () => {
    if (socket) {
      socket.disconnect();
    }

    const token = authStore.token;
    socket = io(window.location.origin, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      console.log('⚡ [Socket.IO Client] Connected to real-time server:', socket.id);
    });

    socket.on('receive_message', (msg) => {
      chatStore.appendMessage(msg);
      if (authStore.user && msg.sender._id !== authStore.user.id) {
        showToast(`💬 New Message from ${msg.sender.name}`, 'info');
      }
    });

    socket.on('notification_received', (notif) => {
      notificationStore.addNotification(notif);
      showToast(`${notif.title}: ${notif.message}`, 'info');
    });

    socket.on('test_drive_updated', (data) => {
      showToast(`🏎️ Booking #${data.testDriveId.substring(18)} updated to: ${data.status}`, 'success');
    });

    socket.on('reservation_updated', (data) => {
      showToast(`🚗 Reservation status updated to: ${data.status}`, 'success');
    });

    socket.on('car_status_changed', (data) => {
      // Background inventory status update
      console.log('⚡ Car status update broadcast received:', data);
    });

    socket.on('disconnect', () => {
      console.log('⚡ [Socket.IO Client] Disconnected');
    });
  };

  const getSocket = () => socket;

  const sendMessage = (data) => {
    return new Promise((resolve, reject) => {
      if (!socket) return reject(new Error('Socket not connected'));
      socket.emit('send_message', data, (response) => {
        if (response.status === 'ok') {
          resolve(response.data);
        } else {
          reject(new Error(response.message));
        }
      });
    });
  };

  return {
    initSocketConnection,
    getSocket,
    sendMessage
  };
}
