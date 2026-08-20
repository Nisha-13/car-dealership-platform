<template>
  <div class="admin-notif-view">
    <div class="admin-notif-header">
      <div class="header-text">
        <h2 class="admin-notif-title">Admin Real-Time Notifications</h2>
        <p class="admin-notif-sub">Live alerts for new customer registrations, test drive bookings, customer inquiries, and incoming chat messages.</p>
      </div>
      <button @click="notifStore.markAllRead" class="btn btn-secondary btn-sm mark-all-btn" v-if="notifStore.notifications.length">
        Mark All as Read
      </button>
    </div>

    <div class="glass-panel notif-panel">
      <div v-if="notifStore.notifications.length" class="notif-list">
        <div
          v-for="notif in notifStore.notifications"
          :key="notif._id"
          class="notif-card"
          :class="{ 'notif-unread': !notif.read }"
        >
          <div class="notif-content">
            <div class="notif-title-row">
              <span class="notif-title">{{ notif.title }}</span>
              <span v-if="!notif.read" class="badge badge-pending notif-badge-pill">NEW</span>
            </div>
            <div class="notif-message">{{ notif.message }}</div>
            <div class="notif-time">
              {{ new Date(notif.createdAt).toLocaleString() }}
            </div>
          </div>

          <div class="notif-actions">
            <router-link v-if="notif.link" :to="notif.link" @click="notifStore.markRead(notif._id)" class="btn btn-primary btn-sm notif-btn">
              View Request →
            </router-link>
            <button v-if="!notif.read" @click="notifStore.markRead(notif._id)" class="btn btn-secondary btn-sm notif-btn">
              Mark Read
            </button>
          </div>
        </div>
      </div>

      <div v-else class="empty-notifs">
        <div class="empty-icon">🔔</div>
        <h3 class="empty-title">No Admin Notifications</h3>
        <p class="empty-desc">When customers register, book test drives, send inquiries, or chat, alerts will appear here in real-time.</p>
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

<style scoped>
.admin-notif-view {
  width: 100%;
}

.admin-notif-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-text {
  flex: 1;
  min-width: 260px;
}

.admin-notif-title {
  font-family: var(--font-heading);
  font-size: 1.45rem;
  font-weight: 700;
  color: var(--text-main);
}

.admin-notif-sub {
  color: var(--text-muted);
  font-size: 0.88rem;
  margin-top: 0.25rem;
}

.mark-all-btn {
  white-space: nowrap;
}

.notif-panel {
  padding: 1.5rem;
}

.notif-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notif-card {
  padding: 1.25rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: var(--transition);
  gap: 1.25rem;
  background: rgba(255, 255, 255, 0.02);
}

.notif-card.notif-unread {
  background: rgba(245, 158, 11, 0.08);
  border-color: rgba(245, 158, 11, 0.3);
}

.notif-content {
  flex: 1;
  min-width: 0;
}

.notif-title-row {
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 0.35rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.notif-title {
  color: var(--text-main);
  word-break: break-word;
}

.notif-badge-pill {
  font-size: 0.65rem;
}

.notif-message {
  color: var(--text-muted);
  font-size: 0.9rem;
  line-height: 1.5;
  word-break: break-word;
}

.notif-time {
  font-size: 0.75rem;
  color: var(--text-dim);
  margin-top: 0.4rem;
}

.notif-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-shrink: 0;
  flex-wrap: wrap;
}

.notif-btn {
  white-space: nowrap;
}

.empty-notifs {
  text-align: center;
  padding: 4rem 1.5rem;
  color: var(--text-muted);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-title {
  font-family: var(--font-heading);
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-main);
}

.empty-desc {
  font-size: 0.9rem;
  color: var(--text-muted);
  max-width: 480px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .admin-notif-header {
    flex-direction: column;
    align-items: stretch;
    margin-bottom: 1.25rem;
  }

  .admin-notif-title {
    font-size: 1.25rem;
  }

  .mark-all-btn {
    align-self: flex-start;
  }

  .notif-panel {
    padding: 1rem;
  }

  .notif-card {
    flex-direction: column;
    align-items: stretch;
    padding: 1rem;
    gap: 0.85rem;
  }

  .notif-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .notif-btn {
    flex: 1;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .empty-notifs {
    padding: 2.5rem 1rem;
  }
}
</style>
