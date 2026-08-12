<template>
  <div>
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem; flex-wrap:wrap; gap:1rem;">
      <div>
        <h2 style="font-family:var(--font-heading); font-size:1.5rem; font-weight:700;">Test Drive Booking Supervisor</h2>
        <p style="color:var(--text-muted); font-size:0.9rem;">Review, confirm, or reject customer test drive requests. Customers receive real-time Socket.IO notifications.</p>
      </div>
      <div style="display:flex; gap:0.75rem;">
        <select v-model="filterStatus" @change="fetchBookings" class="form-select" style="width:auto;">
          <option value="">All Bookings</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Rejected">Rejected</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
    </div>

    <div class="glass-panel" style="padding:1.5rem;">
      <div class="table-responsive" v-if="bookings.length">
        <table class="data-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>Preferred Date & Time</th>
              <th>Status</th>
              <th>Customer Notes</th>
              <th>Admin Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="b in bookings" :key="b._id">
              <td>
                <div style="font-weight:700;">{{ b.user?.name || 'Guest' }}</div>
                <div style="font-size:0.8rem; color:var(--text-muted);">{{ b.user?.email }}</div>
              </td>
              <td>
                <div style="display:flex; align-items:center; gap:0.75rem;">
                  <img :src="b.car?.images?.[0] || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=200&q=80'" style="width:50px; height:36px; object-fit:cover; border-radius:4px;" />
                  <div>
                    <div style="font-weight:700; font-size:0.9rem;">{{ b.car?.title || 'Vehicle' }}</div>
                  </div>
                </div>
              </td>
              <td>
                <div style="font-weight:700;">{{ new Date(b.preferredDate).toLocaleDateString() }}</div>
                <div style="font-size:0.85rem; color:var(--text-muted);">{{ b.preferredTime }}</div>
              </td>
              <td>
                <span class="badge" :class="`badge-${b.status.toLowerCase()}`">{{ b.status }}</span>
              </td>
              <td style="color:var(--text-muted); font-size:0.85rem; max-width:200px;">
                {{ b.notes || '—' }}
              </td>
              <td>
                <div style="display:flex; gap:0.5rem; flex-wrap:wrap;" v-if="b.status === 'Pending'">
                  <button @click="updateStatus(b._id, 'Confirmed')" class="btn btn-sm" style="background:rgba(16,185,129,0.2); color:#10b981; border:1px solid #10b981;">
                    ✓ Confirm
                  </button>
                  <button @click="updateStatus(b._id, 'Rejected')" class="btn btn-sm" style="background:rgba(239,68,68,0.2); color:#ef4444; border:1px solid #ef4444;">
                    ✗ Reject
                  </button>
                </div>
                <div style="display:flex; gap:0.5rem;" v-else-if="b.status === 'Confirmed'">
                  <button @click="updateStatus(b._id, 'Completed')" class="btn btn-sm" style="background:rgba(59,130,246,0.2); color:#60a5fa; border:1px solid #60a5fa;">
                    ✓ Complete
                  </button>
                </div>
                <span v-else style="font-size:0.82rem; color:var(--text-dim);">{{ b.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else style="text-align:center; padding:4rem; color:var(--text-muted);">
        No test drive bookings found for selected status.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAllTestDrivesApi, updateTestDriveStatusApi } from '@/api/testDrive.api';
import { useToast } from '@/composables/useToast';

const bookings = ref([]);
const filterStatus = ref('');
const { showToast } = useToast();

const fetchBookings = async () => {
  try {
    const params = filterStatus.value ? { status: filterStatus.value } : {};
    const res = await getAllTestDrivesApi(params);
    bookings.value = res.data;
  } catch (err) {
    showToast('Failed to load test drive bookings.', 'error');
  }
};

const updateStatus = async (id, status) => {
  try {
    await updateTestDriveStatusApi(id, { status });
    showToast(`Booking ${status}. Customer notified via Socket.IO in real-time.`, 'success');
    fetchBookings();
  } catch (err) {
    showToast(err.message || 'Error updating booking status.', 'error');
  }
};

onMounted(fetchBookings);
</script>
