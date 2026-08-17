<template>
  <div>
    <!-- Metrics Grid -->
    <div class="stats-grid">
      <StatCard title="Active Reservations" :value="stats.activeReservations || 0" icon="🚗" />
      <StatCard title="Active Test Drives" :value="stats.activeTestDrives || 0" icon="🏎️" />
      <StatCard title="Saved Favorites" :value="carStore.favorites.length || 0" icon="♥" />
      <StatCard title="Unread Messages" :value="chatStore.conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0)" icon="✉️" />
    </div>

    <!-- Quick Action Banner -->
    <div class="glass-panel" style="padding:2rem; margin-bottom:2rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1.5rem;">
      <div>
        <h3 style="font-family:var(--font-heading); font-size:1.35rem; font-weight:700; margin-bottom:0.25rem;">Looking for your next luxury vehicle?</h3>
        <p style="color:var(--text-muted); font-size:0.95rem;">Browse our latest inventory additions, lock in a reservation, or connect with our dealer concierge via live chat.</p>
      </div>

      <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
        <router-link to="/cars" class="btn btn-primary btn-sm">Explore Vehicles</router-link>
        <router-link to="/dashboard/reservations" class="btn btn-secondary btn-sm">My Reservations</router-link>
        <router-link to="/dashboard/messages" class="btn btn-secondary btn-sm">Start Live Chat</router-link>
      </div>
    </div>

    <div class="dash-grid-2">
      <!-- Recent Reservations -->
      <div class="glass-panel" style="padding:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
          <h3 style="font-family:var(--font-heading); font-size:1.15rem; font-weight:700;">Recent Reservations</h3>
          <router-link to="/dashboard/reservations" class="btn btn-secondary btn-sm">View All</router-link>
        </div>

        <div class="table-responsive" v-if="recentReservations.length">
          <table class="data-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Dates</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in recentReservations" :key="r._id">
                <td>
                  <div style="display:flex; align-items:center; gap:0.75rem;">
                    <img :src="r.car?.images?.[0] || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=200&q=80'" style="width:44px; height:32px; object-fit:cover; border-radius:4px;" />
                    <span style="font-weight:700; font-size:0.88rem;">{{ r.car?.title || 'Vehicle' }}</span>
                  </div>
                </td>
                <td style="font-size:0.82rem;">
                  {{ formatDate(r.startDate) }} - {{ formatDate(r.endDate) }}
                </td>
                <td>
                  <span class="badge" :class="getBadgeClass(r.status)">{{ r.status }}</span>
                </td>
                <td>
                  <router-link to="/dashboard/reservations" class="btn btn-secondary btn-sm" style="padding:0.25rem 0.5rem; font-size:0.78rem;">
                    Manage
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else style="text-align:center; padding:2rem; color:var(--text-muted); font-size:0.9rem;">
          No active reservations. Find your dream car to place a hold.
        </div>
      </div>

      <!-- Recent Test Drives -->
      <div class="glass-panel" style="padding:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
          <h3 style="font-family:var(--font-heading); font-size:1.15rem; font-weight:700;">Recent Test Drives</h3>
          <router-link to="/dashboard/test-drives" class="btn btn-secondary btn-sm">View All</router-link>
        </div>

        <div class="table-responsive" v-if="recentBookings.length">
          <table class="data-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="b in recentBookings" :key="b._id">
                <td>
                  <div style="display:flex; align-items:center; gap:0.75rem;">
                    <img :src="b.car?.images?.[0] || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=200&q=80'" style="width:44px; height:32px; object-fit:cover; border-radius:4px;" />
                    <span style="font-weight:700; font-size:0.88rem;">{{ b.car?.title || 'Vehicle' }}</span>
                  </div>
                </td>
                <td style="font-size:0.82rem;">{{ formatDate(b.preferredDate) }} ({{ b.preferredTime }})</td>
                <td>
                  <span class="badge" :class="getBadgeClass(b.status)">{{ b.status }}</span>
                </td>
                <td>
                  <router-link to="/dashboard/test-drives" class="btn btn-secondary btn-sm" style="padding:0.25rem 0.5rem; font-size:0.78rem;">
                    Details
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else style="text-align:center; padding:2rem; color:var(--text-muted); font-size:0.9rem;">
          No test drives booked yet. Browse vehicles to schedule one!
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import StatCard from '@/components/common/StatCard.vue';
import { getCustomerStatsApi } from '@/api/stats.api';
import { getMyTestDrivesApi } from '@/api/testDrive.api';
import { getMyReservationsApi } from '@/api/reservation.api';
import { useCarStore } from '@/stores/car';
import { useChatStore } from '@/stores/chat';

const carStore = useCarStore();
const chatStore = useChatStore();

const stats = ref({});
const recentBookings = ref([]);
const recentReservations = ref([]);

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const getBadgeClass = (status) => {
  switch (status) {
    case 'Confirmed': return 'badge-confirmed';
    case 'Pending': return 'badge-pending';
    case 'Completed': return 'badge-available';
    case 'Cancelled': return 'badge-rejected';
    default: return 'badge-available';
  }
};

onMounted(async () => {
  try {
    const statsRes = await getCustomerStatsApi();
    stats.value = statsRes.data;

    const [bookingsRes, reservationsRes] = await Promise.all([
      getMyTestDrivesApi(),
      getMyReservationsApi()
    ]);

    recentBookings.value = (bookingsRes.data || []).slice(0, 4);
    recentReservations.value = (reservationsRes.data || []).slice(0, 4);

    carStore.fetchFavorites();
    chatStore.fetchConversations();
  } catch (err) {
    console.error('Customer dashboard load error:', err);
  }
});
</script>

<style scoped>
.dash-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 900px) {
  .dash-grid-2 {
    grid-template-columns: 1fr;
  }
}
</style>
