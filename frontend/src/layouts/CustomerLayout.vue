<template>
  <div class="dashboard-layout">
    <!-- Backdrop Overlay for Mobile Drawer -->
    <div
      class="sidebar-backdrop"
      :class="{ 'mobile-active': mobileOpen }"
      @click="mobileOpen = false"
    ></div>

    <aside class="dashboard-sidebar" :class="{ 'mobile-open': mobileOpen }">
      <div class="sidebar-header">
        <router-link to="/" class="sidebar-brand">⚡ AUTO<span style="color:var(--primary)">LUXE</span></router-link>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/dashboard" class="sidebar-link" @click="mobileOpen = false">
          📊 Overview
        </router-link>
        <router-link to="/dashboard/test-drives" class="sidebar-link" @click="mobileOpen = false">
          🏎️ My Test Drives
        </router-link>
        <router-link to="/dashboard/favorites" class="sidebar-link" @click="mobileOpen = false">
          ♥ Saved Favorites
        </router-link>
        <router-link to="/dashboard/inquiries" class="sidebar-link" @click="mobileOpen = false">
          💬 My Inquiries
        </router-link>
        <router-link to="/dashboard/messages" class="sidebar-link" @click="mobileOpen = false">
          ✉️ Live Chat
        </router-link>
        <router-link to="/dashboard/notifications" class="sidebar-link" @click="mobileOpen = false">
          🔔 Notifications
          <span v-if="notifStore.unreadCount" class="notif-badge" style="position:static; margin-left:auto;">{{ notifStore.unreadCount }}</span>
        </router-link>
        <router-link to="/dashboard/profile" class="sidebar-link" @click="mobileOpen = false">
          👤 Account Settings
        </router-link>
      </nav>

      <div style="padding: 1.25rem; border-top: 1px solid var(--border-color);">
        <router-link to="/" class="btn btn-secondary btn-full btn-sm" style="margin-bottom: 0.5rem;">
          🌐 Back to Showroom
        </router-link>
        <button @click="handleLogout" class="btn btn-danger btn-full btn-sm">
          Sign Out
        </button>
      </div>
    </aside>

    <div class="dashboard-main">
      <header class="dashboard-topbar">
        <div style="display:flex; align-items:center; gap:1rem;">
          <button class="btn btn-secondary btn-sm mobile-toggle" @click="mobileOpen = !mobileOpen" style="padding:0.4rem 0.75rem;">
            ☰ Menu
          </button>
          <h2 class="topbar-title">{{ pageTitle }}</h2>
        </div>

        <div class="topbar-actions">
          <router-link to="/dashboard/notifications" class="notif-bell" title="Notifications">
            🔔
            <span v-if="notifStore.unreadCount" class="notif-badge">{{ notifStore.unreadCount }}</span>
          </router-link>
          <div style="text-align:right;" class="user-info-badge">
            <div style="font-weight:700; font-size:0.95rem;">{{ authStore.user?.name }}</div>
            <div style="font-size:0.78rem; color:var(--text-muted); font-weight:600;">Customer Portal</div>
          </div>
        </div>
      </header>

      <div class="dashboard-content">
        <router-view />
      </div>
    </div>
    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notification';
import { useSocket } from '@/composables/useSocket';
import Toast from '@/components/common/Toast.vue';

const authStore = useAuthStore();
const notifStore = useNotificationStore();
const { initSocketConnection } = useSocket();
const route = useRoute();
const router = useRouter();
const mobileOpen = ref(false);

const pageTitle = computed(() => {
  if (route.name === 'customer-dashboard') return 'Customer Dashboard';
  if (route.name === 'customer-test-drives') return 'My Test Drives';
  if (route.name === 'customer-favorites') return 'Saved Favorites';
  if (route.name === 'customer-inquiries') return 'My Vehicle Inquiries';
  if (route.name === 'customer-messages') return 'Live Dealer Chat';
  if (route.name === 'customer-notifications') return 'Notifications';
  if (route.name === 'customer-profile') return 'Account Settings';
  return 'Customer Portal';
});

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};

onMounted(() => {
  notifStore.fetchNotifications();
  initSocketConnection();
});
</script>

<style scoped>
.mobile-toggle {
  display: none;
}
@media (max-width: 1024px) {
  .mobile-toggle {
    display: inline-flex;
  }
  .user-info-badge {
    display: none;
  }
}
</style>
