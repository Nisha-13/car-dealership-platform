<template>
  <div>
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem; flex-wrap:wrap; gap:1rem;">
      <div>
        <h2 style="font-family:var(--font-heading); font-size:1.5rem; font-weight:700;">Admin Real-Time Notifications</h2>
        <p style="color:var(--text-muted); font-size:0.9rem;">Live alerts for new test drive bookings, customer inquiries, and incoming chat messages.</p>
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
          style="padding:1.25rem; border-radius:var(--radius-sm); border:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; transition:var(--transition); gap:1rem; flex-wrap:wrap;"
          :style="{ background: notif.read ? 'rgba(255,255,255,0.02)' : 'rgba(245, 158, 11, 0.08)' }"
        >
          <div>
            <div style="font-weight:700; font-size:1rem; margin-bottom:0.25rem; display:flex; align-items:center; gap:0.5rem;">
              <span>{{ notif.title }}</span>
              <span v-if="!notif.read" class="badge badge-pending" style="font-size:0.65rem;">NEW</span>
            </div>
            <div style="color:var(--text-muted); font-size:0.9rem;">{{ notif.message }}</div>
            <div style="font-size:0.75rem; color:var(--text-dim); margin-top:0.4rem;">
              {{ new Date(notif.createdAt).toLocaleString() }}
            </div>
          </div>

          <div style="display:flex; gap:0.5rem; align-items:center;">
            <router-link v-if="notif.link" :to="notif.link" @click="notifStore.markRead(notif._id)" class="btn btn-primary btn-sm">
              View Request →
            </router-link>
            <button v-if="!notif.read" @click="notifStore.markRead(notif._id)" class="btn btn-secondary btn-sm">
              Mark Read
            </button>
          </div>
        </div>
      </div>

      <div v-else style="text-align:center; padding:4rem; color:var(--text-muted);">
        <div style="font-size:3rem; margin-bottom:1rem;">🔔</div>
        <h3 style="font-family:var(--font-heading); font-size:1.2rem; font-weight:700; margin-bottom:0.5rem;">No Admin Notifications</h3>
        <p style="color:var(--text-muted); font-size:0.9rem;">When customers book test drives, send inquiries, or chat, alerts will appear here in real-time.</p>
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
