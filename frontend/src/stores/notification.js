import { defineStore } from 'pinia';
import { getNotificationsApi, markNotificationReadApi, markAllNotificationsReadApi } from '@/api/notification.api';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [],
    unreadCount: 0,
    loading: false
  }),

  actions: {
    async fetchNotifications() {
      try {
        const res = await getNotificationsApi();
        this.notifications = res.data.notifications;
        this.unreadCount = res.data.unreadCount;
      } catch (err) {
        console.error('Fetch notifications error:', err);
      }
    },

    async markRead(id) {
      try {
        await markNotificationReadApi(id);
        const notif = this.notifications.find(n => n._id === id);
        if (notif && !notif.read) {
          notif.read = true;
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        }
      } catch (err) {
        console.error('Mark notification read error:', err);
      }
    },

    async markAllRead() {
      try {
        await markAllNotificationsReadApi();
        this.notifications.forEach(n => n.read = true);
        this.unreadCount = 0;
      } catch (err) {
        console.error('Mark all read error:', err);
      }
    },

    addNotification(notif) {
      this.notifications.unshift(notif);
      this.unreadCount++;
    }
  }
});
