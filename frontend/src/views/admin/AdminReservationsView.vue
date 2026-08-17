<template>
  <div class="admin-reservations-view">
    <div class="view-header">
      <div>
        <h2 class="view-title">Car Reservation Supervisor</h2>
        <p class="view-sub">Manage VIP vehicle reservations, confirm bookings, update statuses, and release inventory.</p>
      </div>

      <div class="header-controls">
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search customer, car, or license..."
            class="form-input search-input"
          />
        </div>

        <select v-model="filterStatus" @change="fetchReservations" class="form-select status-select">
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
    </div>

    <!-- Reservations Table Panel -->
    <div class="glass-panel content-panel">
      <div class="table-responsive" v-if="filteredReservations.length">
        <table class="data-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Reserved Vehicle</th>
              <th>Reservation Dates</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Notes / License</th>
              <th>Admin Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="res in filteredReservations" :key="res._id">
              <!-- Customer Column -->
              <td>
                <div class="user-cell">
                  <div class="user-avatar-initials">
                    {{ res.user?.name ? res.user.name.charAt(0).toUpperCase() : 'U' }}
                  </div>
                  <div>
                    <div class="user-name">{{ res.user?.name || 'Unknown Client' }}</div>
                    <div class="user-email">{{ res.user?.email }}</div>
                    <div class="user-phone" v-if="res.contactPhone || res.user?.phone">
                      📞 {{ res.contactPhone || res.user?.phone }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- Vehicle Column -->
              <td>
                <div class="car-cell">
                  <img
                    :src="res.car?.images?.[0] || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=200&q=80'"
                    :alt="res.car?.title || 'Vehicle'"
                    class="car-img"
                  />
                  <div>
                    <div class="car-title">{{ res.car?.title || 'Vehicle' }}</div>
                    <div class="car-meta">
                      <span>{{ res.car?.brand }} ({{ res.car?.year }})</span>
                      <span class="car-price">${{ res.car?.price?.toLocaleString() }}</span>
                    </div>
                    <span
                      class="car-status-pill"
                      :class="`status-${res.car?.status ? res.car.status.toLowerCase() : 'available'}`"
                    >
                      Car: {{ res.car?.status || 'Available' }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- Reservation Dates Column -->
              <td>
                <div class="dates-cell">
                  <div class="date-range">
                    <span>{{ formatDate(res.startDate) }}</span>
                    <span class="arrow">➔</span>
                    <span>{{ formatDate(res.endDate) }}</span>
                  </div>
                </div>
              </td>

              <!-- Duration Column -->
              <td>
                <div class="days-count">
                  <span class="days-pill">{{ res.totalDays }} {{ res.totalDays === 1 ? 'Day' : 'Days' }}</span>
                </div>
              </td>

              <!-- Reservation Status -->
              <td>
                <span class="badge" :class="getStatusBadgeClass(res.status)">
                  {{ res.status }}
                </span>
                <div v-if="res.confirmedAt" class="date-stamp">
                  Confirmed: {{ formatDate(res.confirmedAt) }}
                </div>
                <div v-if="res.cancelledAt" class="date-stamp text-danger">
                  Cancelled: {{ formatDate(res.cancelledAt) }}
                </div>
              </td>

              <!-- Notes & License -->
              <td style="max-width: 220px;">
                <div class="notes-cell">
                  <div v-if="res.driverLicense" class="license-tag">
                    🪪 {{ res.driverLicense }}
                  </div>
                  <div v-if="res.customerNotes" class="customer-note" :title="res.customerNotes">
                    <strong>Client:</strong> {{ res.customerNotes }}
                  </div>
                  <div v-if="res.adminNotes" class="admin-note" :title="res.adminNotes">
                    <strong>Dealer:</strong> {{ res.adminNotes }}
                  </div>
                  <div v-if="!res.customerNotes && !res.adminNotes && !res.driverLicense" style="color:var(--text-dim); font-size:0.8rem;">
                    —
                  </div>
                </div>
              </td>

              <!-- Actions Column -->
              <td>
                <div class="actions-cell">
                  <!-- Pending State Actions -->
                  <template v-if="res.status === 'Pending'">
                    <button
                      @click="handleStatusUpdate(res._id, 'Confirmed')"
                      class="btn btn-sm btn-action-confirm"
                      title="Confirm Reservation and hold car"
                    >
                      ✓ Confirm
                    </button>
                    <button
                      @click="handleStatusUpdate(res._id, 'Cancelled')"
                      class="btn btn-sm btn-action-cancel"
                      title="Cancel reservation & release vehicle"
                    >
                      ✗ Cancel
                    </button>
                  </template>

                  <!-- Confirmed State Actions -->
                  <template v-else-if="res.status === 'Confirmed'">
                    <button
                      @click="handleStatusUpdate(res._id, 'Completed')"
                      class="btn btn-sm btn-action-complete"
                      title="Complete Reservation"
                    >
                      ✔ Complete
                    </button>
                    <button
                      @click="handleStatusUpdate(res._id, 'Cancelled')"
                      class="btn btn-sm btn-action-cancel"
                      title="Cancel Reservation"
                    >
                      ✗ Cancel
                    </button>
                  </template>

                  <!-- Release Car Option if car is still marked Reserved -->
                  <button
                    v-if="res.car?.status === 'Reserved' && ['Cancelled', 'Completed'].includes(res.status)"
                    @click="handleReleaseCar(res._id)"
                    class="btn btn-sm btn-action-release"
                    title="Release vehicle back to Available status"
                  >
                    🔄 Release Car
                  </button>

                  <button
                    @click="openNotesModal(res)"
                    class="btn btn-secondary btn-sm"
                    title="Edit Admin Notes"
                  >
                    📝 Note
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">🚗</div>
        <h3 class="empty-title">No Reservations Found</h3>
        <p class="empty-sub">No vehicle reservations match your current search and status filter.</p>
      </div>
    </div>

    <!-- Admin Notes Modal -->
    <div v-if="showNotesModal" class="modal-backdrop" @click.self="showNotesModal = false">
      <div class="glass-panel modal-box">
        <div class="modal-header">
          <h3 class="modal-title">Edit Reservation Notes</h3>
          <button @click="showNotesModal = false" class="modal-close">✕</button>
        </div>

        <form @submit.prevent="saveNotes">
          <div class="form-group">
            <label class="form-label">Dealer Internal Notes</label>
            <textarea
              v-model="editingNotes"
              class="form-textarea"
              rows="4"
              placeholder="Add concierge assignment, verification status, or special handling..."
            ></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" @click="showNotesModal = false" class="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="savingNotes">
              {{ savingNotes ? 'Saving...' : 'Save Notes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  getAllReservationsApi,
  updateReservationStatusApi,
  releaseCarApi
} from '@/api/reservation.api';
import { useToast } from '@/composables/useToast';

const reservations = ref([]);
const filterStatus = ref('');
const searchQuery = ref('');
const showNotesModal = ref(false);
const selectedRes = ref(null);
const editingNotes = ref('');
const savingNotes = ref(false);
const { showToast } = useToast();

const fetchReservations = async () => {
  try {
    const params = filterStatus.value ? { status: filterStatus.value } : {};
    const res = await getAllReservationsApi(params);
    reservations.value = res.data || [];
  } catch (err) {
    showToast('Failed to load reservations list.', 'error');
  }
};

const filteredReservations = computed(() => {
  if (!searchQuery.value) return reservations.value;
  const q = searchQuery.value.toLowerCase();
  return reservations.value.filter(r => {
    const uName = r.user?.name?.toLowerCase() || '';
    const uEmail = r.user?.email?.toLowerCase() || '';
    const cTitle = r.car?.title?.toLowerCase() || '';
    const license = r.driverLicense?.toLowerCase() || '';
    return uName.includes(q) || uEmail.includes(q) || cTitle.includes(q) || license.includes(q);
  });
});

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Confirmed': return 'badge-confirmed';
    case 'Pending': return 'badge-pending';
    case 'Completed': return 'badge-available';
    case 'Cancelled': return 'badge-rejected';
    default: return 'badge-available';
  }
};

const handleStatusUpdate = async (id, status) => {
  try {
    await updateReservationStatusApi(id, { status });
    showToast(`Reservation marked as ${status}. Client notified in real-time.`, 'success');
    await fetchReservations();
  } catch (err) {
    showToast(err.message || `Failed to update status to ${status}.`, 'error');
  }
};

const handleReleaseCar = async (id) => {
  try {
    await releaseCarApi(id);
    showToast('Vehicle status successfully restored to Available in showroom!', 'success');
    await fetchReservations();
  } catch (err) {
    showToast(err.message || 'Error releasing car.', 'error');
  }
};

const openNotesModal = (res) => {
  selectedRes.value = res;
  editingNotes.value = res.adminNotes || '';
  showNotesModal.value = true;
};

const saveNotes = async () => {
  if (!selectedRes.value) return;
  savingNotes.value = true;
  try {
    await updateReservationStatusApi(selectedRes.value._id, {
      status: selectedRes.value.status,
      adminNotes: editingNotes.value
    });
    showToast('Admin notes updated successfully.', 'success');
    showNotesModal.value = false;
    await fetchReservations();
  } catch (err) {
    showToast(err.message || 'Error saving notes.', 'error');
  } finally {
    savingNotes.value = false;
  }
};

onMounted(fetchReservations);
</script>

<style scoped>
.admin-reservations-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.view-title {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.view-sub {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.header-controls {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  min-width: 260px;
}

.status-select {
  width: auto;
  min-width: 140px;
}

.content-panel {
  padding: 0;
  overflow: hidden;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.88rem;
}

.data-table th {
  background: rgba(255, 255, 255, 0.03);
  padding: 1rem 1.25rem;
  color: var(--text-muted);
  font-weight: 600;
  border-bottom: 1px solid var(--border-color);
  white-space: nowrap;
}

.data-table td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.data-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.02);
}

/* User Cell */
.user-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar-initials {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--primary);
  color: #000;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  flex-shrink: 0;
}

.user-name {
  font-weight: 700;
  color: var(--text-main);
}

.user-email {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.user-phone {
  font-size: 0.75rem;
  color: var(--text-dim);
  margin-top: 0.15rem;
}

/* Car Cell */
.car-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 200px;
}

.car-img {
  width: 58px;
  height: 42px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  flex-shrink: 0;
}

.car-title {
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.2;
}

.car-meta {
  font-size: 0.78rem;
  color: var(--text-muted);
  display: flex;
  gap: 0.4rem;
  align-items: center;
  margin-top: 0.15rem;
}

.car-price {
  color: var(--primary);
  font-weight: 600;
}

.car-status-pill {
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  margin-top: 0.2rem;
}

.car-status-pill.status-available {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
}

.car-status-pill.status-reserved {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.car-status-pill.status-sold {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

/* Dates Cell */
.dates-cell {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.date-range {
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  white-space: nowrap;
}

.arrow {
  color: var(--primary);
  font-size: 0.75rem;
}

.days-count {
  font-size: 0.8rem;
}

.days-pill {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--border-color);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.date-stamp {
  font-size: 0.72rem;
  color: var(--text-dim);
  margin-top: 0.3rem;
}

.text-danger {
  color: #ef4444;
}

/* Notes Cell */
.notes-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.license-tag {
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
  border: 1px solid var(--border-color);
  width: fit-content;
  color: var(--text-main);
  font-weight: 600;
}

.customer-note,
.admin-note {
  font-size: 0.75rem;
  line-height: 1.4;
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Action buttons */
.actions-cell {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.btn-action-confirm {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid #10b981;
}
.btn-action-confirm:hover {
  background: rgba(16, 185, 129, 0.35);
}

.btn-action-cancel {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid #ef4444;
}
.btn-action-cancel:hover {
  background: rgba(239, 68, 68, 0.35);
}

.btn-action-complete {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  border: 1px solid #60a5fa;
}
.btn-action-complete:hover {
  background: rgba(59, 130, 246, 0.35);
}

.btn-action-release {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border: 1px solid #f59e0b;
}
.btn-action-release:hover {
  background: rgba(245, 158, 11, 0.35);
}

/* Badges */
.badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  display: inline-block;
}

.badge-available {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.badge-confirmed {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.badge-pending {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.badge-rejected {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 1.5rem;
}

.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.empty-title {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.empty-sub {
  color: var(--text-muted);
  font-size: 0.9rem;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-box {
  width: 100%;
  max-width: 480px;
  padding: 2rem;
  background: var(--bg-surface);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.modal-title {
  font-family: var(--font-heading);
  font-size: 1.2rem;
  font-weight: 700;
}

.modal-close {
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  transition: var(--transition);
}

.modal-close:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
  color: #ef4444;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}
</style>
