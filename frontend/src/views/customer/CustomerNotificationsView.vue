<template>
  <div>
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem;">
      <div>
        <h2 style="font-family:var(--font-heading); font-size:1.5rem; font-weight:700;">Real-Time System Notifications</h2>
        <p style="color:var(--text-muted); font-size:0.9rem;">Live updates on test drive bookings, appointment reminders, and dealer replies.</p>
      </div>
      <button @click="notifStore.markAllRead" class="btn btn-secondary btn-sm" v-if="notifStore.notifications.length">
        Mark All as Read
      </button>
    </div>

    <div class="glass-panel" style="padding:1.5rem;">
      <div v-if="notifStore.notifications.length" style="display:flex; flex-direction:column; gap:1rem;">
        <div
          v-for="notif in notifStore.notifications"
          :key="notif._id"
          style="padding:1.25rem; border-radius:var(--radius-sm); border:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; transition:var(--transition);"
          :style="{ background: notif.read ? 'rgba(255,255,255,0.02)' : 'rgba(245, 158, 11, 0.08)' }"
        >
          <div>
            <div style="font-weight:700; font-size:1rem; margin-bottom:0.25rem;">{{ notif.title }}</div>
            <div style="color:var(--text-muted); font-size:0.9rem;">{{ notif.message }}</div>
            <div style="font-size:0.75rem; color:var(--text-dim); margin-top:0.4rem;">
              {{ new Date(notif.createdAt).toLocaleString() }}
            </div>
          </div>

          <button v-if="!notif.read" @click="notifStore.markRead(notif._id)" class="btn btn-secondary btn-sm">
            Mark Read
          </button>
        </div>
      </div>

      <div v-else style="text-align:center; padding:4rem; color:var(--text-muted);">
        No notifications yet.
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useNotificationStore } from '@/stores/notification';

const notifStore = useNotificationStore();

onMounted(() => {
  notifStore.fetchNotifications();
});
</script>
