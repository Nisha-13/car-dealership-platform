<template>
  <div>
    <!-- Metrics Grid -->
    <div class="stats-grid">
      <StatCard title="Active Test Drives" :value="stats.activeTestDrives || 0" icon="🏎️" />
      <StatCard title="Saved Favorites" :value="carStore.favorites.length || 0" icon="♥" />
      <StatCard title="My Inquiries" :value="stats.unreadInquiries || 0" icon="💬" />
      <StatCard title="Unread Messages" :value="chatStore.conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0)" icon="✉️" />
    </div>

    <!-- Quick Action Banner -->
    <div class="glass-panel" style="padding:2rem; margin-bottom:2rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1.5rem;">
      <div>
        <h3 style="font-family:var(--font-heading); font-size:1.35rem; font-weight:700; margin-bottom:0.25rem;">Looking for your next luxury vehicle?</h3>
        <p style="color:var(--text-muted); font-size:0.95rem;">Browse our latest inventory additions or connect with our dealer team via real-time live chat.</p>
      </div>

      <div style="display:flex; gap:0.75rem;">
        <router-link to="/cars" class="btn btn-primary btn-sm">Explore Vehicles</router-link>
        <router-link to="/dashboard/messages" class="btn btn-secondary btn-sm">Start Live Chat</router-link>
      </div>
    </div>

    <!-- Recent Test Drives -->
    <div class="glass-panel" style="padding:1.5rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
        <h3 style="font-family:var(--font-heading); font-size:1.2rem; font-weight:700;">Recent Test Drive Bookings</h3>
        <router-link to="/dashboard/test-drives" class="btn btn-secondary btn-sm">View All</router-link>
      </div>

      <div class="table-responsive" v-if="recentBookings.length">
        <table class="data-table">
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="b in recentBookings" :key="b._id">
              <td>
                <div style="display:flex; align-items:center; gap:0.75rem;">
                  <img :src="b.car?.images?.[0] || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=200&q=80'" style="width:48px; height:36px; object-fit:cover; border-radius:4px;" />
                  <span style="font-weight:700;">{{ b.car?.title || 'Vehicle' }}</span>
                </div>
              </td>
              <td>{{ new Date(b.preferredDate).toLocaleDateString() }} at {{ b.preferredTime }}</td>
              <td>
                <span class="badge" :class="`badge-${b.status.toLowerCase()}`">{{ b.status }}</span>
              </td>
              <td>
                <router-link :to="`/cars/${b.car?._id}`" class="btn btn-secondary btn-sm">View Car</router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else style="text-align:center; padding:2rem; color:var(--text-muted);">
        No test drives booked yet. Browse vehicles to schedule one!
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import StatCard from '@/components/common/StatCard.vue';
import { getCustomerStatsApi } from '@/api/stats.api';
import { getMyTestDrivesApi } from '@/api/testDrive.api';
import { useCarStore } from '@/stores/car';
import { useChatStore } from '@/stores/chat';

const carStore = useCarStore();
const chatStore = useChatStore();

const stats = ref({});
const recentBookings = ref([]);

onMounted(async () => {
  try {
    const statsRes = await getCustomerStatsApi();
    stats.value = statsRes.data;

    const bookingsRes = await getMyTestDrivesApi();
    recentBookings.value = bookingsRes.data.slice(0, 5);

    carStore.fetchFavorites();
    chatStore.fetchConversations();
  } catch (err) {
    console.error('Customer dashboard load error:', err);
  }
});
</script>
