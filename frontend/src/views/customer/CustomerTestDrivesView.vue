<template>
  <div>
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem;">
      <div>
        <h2 style="font-family:var(--font-heading); font-size:1.5rem; font-weight:700;">My Scheduled Test Drives</h2>
        <p style="color:var(--text-muted); font-size:0.9rem;">Track real-time status updates and dealer responses for your vehicle test drive requests.</p>
      </div>
      <router-link to="/cars" class="btn btn-primary btn-sm">+ Book New Test Drive</router-link>
    </div>

    <div class="glass-panel" style="padding:1.5rem;">
      <div class="table-responsive" v-if="bookings.length">
        <table class="data-table">
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Preferred Date</th>
              <th>Time Slot</th>
              <th>Status</th>
              <th>Dealer Notes</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="b in bookings" :key="b._id">
              <td>
                <div style="display:flex; align-items:center; gap:0.75rem;">
                  <img :src="b.car?.images?.[0] || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=200&q=80'" style="width:54px; height:38px; object-fit:cover; border-radius:4px;" />
                  <div>
                    <div style="font-weight:700;">{{ b.car?.title || 'Vehicle' }}</div>
                    <div style="font-size:0.8rem; color:var(--primary);">${{ b.car?.price?.toLocaleString() }}</div>
                  </div>
                </div>
              </td>
              <td>{{ new Date(b.preferredDate).toLocaleDateString() }}</td>
              <td>{{ b.preferredTime }}</td>
              <td>
                <span class="badge" :class="`badge-${b.status.toLowerCase()}`">{{ b.status }}</span>
              </td>
              <td style="color:var(--text-muted); font-size:0.88rem;">
                {{ b.dealerNotes || 'Awaiting dealer review...' }}
              </td>
              <td>
                <button
                  v-if="['Pending', 'Confirmed'].includes(b.status)"
                  @click="handleCancel(b._id)"
                  class="btn btn-danger btn-sm"
                >
                  Cancel
                </button>
                <span v-else style="color:var(--text-dim); font-size:0.85rem;">Completed</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else style="text-align:center; padding:4rem;">
        <div style="font-size:3rem; margin-bottom:1rem;">🏎️</div>
        <h3 style="font-family:var(--font-heading); font-size:1.3rem; font-weight:700; margin-bottom:0.5rem;">No Test Drive Bookings Yet</h3>
        <p style="color:var(--text-muted); margin-bottom:1.5rem;">Explore our showroom and pick your dream car for a VIP driving experience.</p>
        <router-link to="/cars" class="btn btn-primary">Browse Vehicles</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getMyTestDrivesApi, cancelTestDriveApi } from '@/api/testDrive.api';
import { useToast } from '@/composables/useToast';

const bookings = ref([]);
const { showToast } = useToast();

const fetchBookings = async () => {
  try {
    const res = await getMyTestDrivesApi();
    bookings.value = res.data;
  } catch (err) {
    showToast('Failed to load test drive bookings.', 'error');
  }
};

const handleCancel = async (id) => {
  if (!confirm('Are you sure you want to cancel this test drive booking?')) return;
  try {
    await cancelTestDriveApi(id);
    showToast('Booking cancelled.', 'info');
    fetchBookings();
  } catch (err) {
    showToast(err.message || 'Error cancelling booking.', 'error');
  }
};

onMounted(fetchBookings);
</script>
