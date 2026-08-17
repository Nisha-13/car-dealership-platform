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
        <router-link to="/" class="sidebar-brand">👑 AUTO<span style="color:var(--primary)">LUXE ADMIN</span></router-link>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/admin/dashboard" class="sidebar-link" @click="mobileOpen = false">
          📊 Executive Stats
        </router-link>
        <router-link to="/admin/cars" class="sidebar-link" @click="mobileOpen = false">
          🏎️ Inventory (Cars)
        </router-link>
        <router-link to="/admin/reservations" class="sidebar-link" @click="mobileOpen = false">
          🚗 Car Reservations
        </router-link>
        <router-link to="/admin/categories" class="sidebar-link" @click="mobileOpen = false">
          🏷️ Categories
        </router-link>
        <router-link to="/admin/test-drives" class="sidebar-link" @click="mobileOpen = false">
          📅 Test Drive Bookings
        </router-link>
        <router-link to="/admin/inquiries" class="sidebar-link" @click="mobileOpen = false">
          💬 Customer Inquiries
        </router-link>
        <router-link to="/admin/messages" class="sidebar-link" @click="mobileOpen = false">
          ✉️ Live Customer Support
          <span v-if="unreadChatCount" class="notif-badge" style="position:static; margin-left:auto;">{{ unreadChatCount }}</span>
        </router-link>
        <router-link to="/admin/notifications" class="sidebar-link" @click="mobileOpen = false">
          🔔 Notifications
          <span v-if="notifStore.unreadCount" class="notif-badge" style="position:static; margin-left:auto;">{{ notifStore.unreadCount }}</span>
        </router-link>
        <router-link to="/admin/customers" class="sidebar-link" @click="mobileOpen = false">
          👥 Manage Customers
        </router-link>
        <router-link to="/admin/activity-logs" class="sidebar-link" @click="mobileOpen = false">
          📜 Activity Logs
        </router-link>
      </nav>

      <div style="padding: 1.25rem; border-top: 1px solid var(--border-color);">
        <router-link to="/" class="btn btn-secondary btn-full btn-sm" style="margin-bottom: 0.5rem;">
          🌐 Showroom View
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
          <router-link to="/admin/notifications" class="notif-bell" title="Admin Notifications">
            🔔
            <span v-if="notifStore.unreadCount" class="notif-badge">{{ notifStore.unreadCount }}</span>
          </router-link>
          <div style="text-align:right;" class="user-info-badge">
            <div style="font-weight:700; font-size:0.95rem;">{{ authStore.user?.name }}</div>
            <div style="font-size:0.78rem; color:var(--primary); font-weight:800; text-transform:uppercase;">Dealer Administrator</div>
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
import { useChatStore } from '@/stores/chat';
import { useSocket } from '@/composables/useSocket';
import Toast from '@/components/common/Toast.vue';

const authStore = useAuthStore();
const notifStore = useNotificationStore();
const chatStore = useChatStore();
const { initSocketConnection } = useSocket();
const route = useRoute();
const router = useRouter();
const mobileOpen = ref(false);

const unreadChatCount = computed(() => {
  return chatStore.conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
});

const pageTitle = computed(() => {
  if (route.name === 'admin-dashboard') return 'Executive Dealer Overview';
  if (route.name === 'admin-cars') return 'Vehicle Inventory Management';
  if (route.name === 'admin-car-create') return 'Add New Luxury Vehicle';
  if (route.name === 'admin-car-edit') return 'Edit Vehicle Details';
  if (route.name === 'admin-reservations') return 'Car Reservation Supervisor';
  if (route.name === 'admin-categories') return 'Category Management';
  if (route.name === 'admin-test-drives') return 'Test Drive Supervisor';
  if (route.name === 'admin-inquiries') return 'Customer Inquiries';
  if (route.name === 'admin-messages') return 'Real-Time Customer Support Console';
  if (route.name === 'admin-notifications') return 'Admin Notifications Center';
  if (route.name === 'admin-customers') return 'Registered Customers';
  if (route.name === 'admin-activity-logs') return 'System Audit & Activity Logs';
  return 'Admin Console';
});

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};

onMounted(() => {
  notifStore.fetchNotifications();
  chatStore.fetchConversations();
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
