<template>
  <div class="customer-reservations-view">
    <div class="view-header">
      <div>
        <h2 class="view-title">My Vehicle Reservations</h2>
        <p class="view-sub">Track your VIP car reservations, review pickup schedules, and manage showroom holds.</p>
      </div>
      <router-link to="/cars" class="btn btn-primary btn-sm">+ Reserve Another Car</router-link>
    </div>

    <!-- Status Filters -->
    <div class="filters-bar glass-panel">
      <div class="filter-tabs">
        <button
          v-for="tab in filterTabs"
          :key="tab.value"
          @click="activeFilter = tab.value"
          class="tab-btn"
          :class="{ active: activeFilter === tab.value }"
        >
          {{ tab.label }}
          <span class="tab-count" v-if="getTabCount(tab.value) !== undefined">
            {{ getTabCount(tab.value) }}
          </span>
        </button>
      </div>
    </div>

    <!-- Reservations Table / Cards Container -->
    <div class="glass-panel content-box">
      <div class="table-responsive" v-if="filteredReservations.length">
        <table class="data-table">
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Reservation Dates</th>
              <th>Hold Duration</th>
              <th>Status</th>
              <th>Pickup Details</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="res in filteredReservations" :key="res._id">
              <td>
                <div class="car-info-cell">
                  <img
                    :src="res.car?.images?.[0] || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=200&q=80'"
                    :alt="res.car?.title || 'Vehicle'"
                    class="car-thumb"
                  />
                  <div>
                    <div class="car-title">{{ res.car?.title || 'Luxury Vehicle' }}</div>
                    <div class="car-sub">
                      <span>{{ res.car?.brand }} ({{ res.car?.year }})</span>
                      <span class="car-price">${{ res.car?.price?.toLocaleString() }}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <div class="dates-cell">
                  <div class="date-range">
                    <span>{{ formatDate(res.startDate) }}</span>
                    <span class="date-arrow">➔</span>
                    <span>{{ formatDate(res.endDate) }}</span>
                  </div>
                </div>
              </td>
              <td>
                <div class="deposit-cell">
                  <span class="days-badge">{{ res.totalDays }} {{ res.totalDays === 1 ? 'Day' : 'Days' }}</span>
                </div>
              </td>
              <td>
                <span class="badge" :class="getStatusBadgeClass(res.status)">
                  {{ res.status }}
                </span>
                <div v-if="res.adminNotes" class="admin-note-preview" :title="res.adminNotes">
                  💬 {{ res.adminNotes }}
                </div>
              </td>
              <td>
                <div class="pickup-cell">
                  <div class="pickup-loc">{{ res.pickupLocation || 'VIP Showroom' }}</div>
                  <div class="pickup-license" v-if="res.driverLicense">License: {{ res.driverLicense }}</div>
                </div>
              </td>
              <td>
                <div class="action-buttons">
                  <button
                    v-if="['Pending', 'Confirmed'].includes(res.status)"
                    @click="openCancelModal(res)"
                    class="btn btn-danger btn-sm"
                  >
                    Cancel
                  </button>
                  <router-link
                    v-if="res.car?._id"
                    :to="`/cars/${res.car._id}`"
                    class="btn btn-secondary btn-sm"
                  >
                    View Car
                  </router-link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">🚗</div>
        <h3 class="empty-title">
          {{ activeFilter === 'ALL' ? 'No Vehicle Reservations Yet' : `No ${activeFilter} Reservations` }}
        </h3>
        <p class="empty-sub">
          {{ activeFilter === 'ALL'
            ? 'Explore our world-class luxury fleet and lock in your dream car today.'
            : 'You do not have any reservations matching this status filter.'
          }}
        </p>
        <router-link to="/cars" class="btn btn-primary">Browse Showroom Fleet</router-link>
      </div>
    </div>

    <!-- Cancellation Confirmation Modal -->
    <div v-if="showCancelModal" class="modal-backdrop" @click.self="showCancelModal = false">
      <div class="glass-panel modal-box">
        <div class="modal-header">
          <h3 class="modal-title">Cancel Vehicle Reservation</h3>
          <button @click="showCancelModal = false" class="modal-close">✕</button>
        </div>

        <p class="modal-warning">
          Are you sure you want to cancel your reservation for
          <strong>{{ selectedReservation?.car?.title || 'this vehicle' }}</strong>?
          The vehicle will be released back to the showroom fleet as <strong>Available</strong>.
        </p>

        <form @submit.prevent="confirmCancel">
          <div class="form-group">
            <label class="form-label">Reason for Cancellation (Optional)</label>
            <textarea
              v-model="cancellationReason"
              class="form-textarea"
              rows="3"
              placeholder="Change of schedule, decided on a different model, etc."
            ></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" @click="showCancelModal = false" class="btn btn-secondary">
              Keep Reservation
            </button>
            <button type="submit" class="btn btn-danger" :disabled="cancelling">
              {{ cancelling ? 'Cancelling...' : 'Confirm Cancellation' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getMyReservationsApi, cancelReservationApi } from '@/api/reservation.api';
import { useToast } from '@/composables/useToast';

const reservations = ref([]);
const activeFilter = ref('ALL');
const showCancelModal = ref(false);
const selectedReservation = ref(null);
const cancellationReason = ref('');
const cancelling = ref(false);
const { showToast } = useToast();

const filterTabs = [
  { label: 'All Reservations', value: 'ALL' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Confirmed', value: 'Confirmed' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Cancelled', value: 'Cancelled' }
];

const fetchReservations = async () => {
  try {
    const res = await getMyReservationsApi();
    reservations.value = res.data || [];
  } catch (err) {
    showToast(err.message || 'Failed to load reservations.', 'error');
  }
};

const filteredReservations = computed(() => {
  if (activeFilter.value === 'ALL') return reservations.value;
  return reservations.value.filter(r => r.status === activeFilter.value);
});

const getTabCount = (filterValue) => {
  if (filterValue === 'ALL') return reservations.value.length;
  return reservations.value.filter(r => r.status === filterValue).length;
};

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

const openCancelModal = (res) => {
  selectedReservation.value = res;
  cancellationReason.value = '';
  showCancelModal.value = true;
};

const confirmCancel = async () => {
  if (!selectedReservation.value) return;
  cancelling.value = true;
  try {
    await cancelReservationApi(selectedReservation.value._id, {
      cancellationReason: cancellationReason.value
    });
    showToast('Reservation cancelled. The vehicle has been released back to showroom.', 'info');
    showCancelModal.value = false;
    await fetchReservations();
  } catch (err) {
    showToast(err.message || 'Error cancelling reservation.', 'error');
  } finally {
    cancelling.value = false;
  }
};

onMounted(fetchReservations);
</script>

<style scoped>
.customer-reservations-view {
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

/* Filters bar */
.filters-bar {
  padding: 0.75rem 1rem;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
}

.tab-btn {
  background: transparent;
  border: 1px solid transparent;
  color: var(--text-muted);
  padding: 0.45rem 0.9rem;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  transition: var(--transition);
}

.tab-btn:hover {
  color: var(--text-main);
  background: rgba(255, 255, 255, 0.04);
}

.tab-btn.active {
  background: rgba(212, 160, 23, 0.15);
  border-color: rgba(212, 160, 23, 0.4);
  color: var(--primary);
}

.tab-count {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.1rem 0.4rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
}

.tab-btn.active .tab-count {
  background: var(--primary);
  color: #000;
}

/* Content Box */
.content-box {
  padding: 1.5rem;
}

/* Table styling */
.car-info-cell {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.car-thumb {
  width: 58px;
  height: 40px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  flex-shrink: 0;
}

.car-title {
  font-weight: 700;
  font-size: 0.92rem;
}

.car-sub {
  font-size: 0.8rem;
  color: var(--text-muted);
  display: flex;
  gap: 0.6rem;
  align-items: center;
}

.car-price {
  color: var(--primary);
  font-weight: 700;
}

.dates-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.date-range {
  font-weight: 700;
  font-size: 0.88rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  white-space: nowrap;
}

.date-arrow {
  color: var(--primary);
  font-size: 0.75rem;
}

.days-badge {
  font-size: 0.75rem;
  color: var(--text-dim);
  font-weight: 600;
}

.deposit-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.deposit-amount {
  font-weight: 800;
  font-size: 0.95rem;
  color: var(--text-main);
}

.payment-badge {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  display: inline-block;
  width: fit-content;
}

.payment-paid {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.payment-refunded {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.payment-pending {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.admin-note-preview {
  font-size: 0.75rem;
  color: var(--text-dim);
  margin-top: 0.35rem;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pickup-cell {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.pickup-loc {
  font-size: 0.85rem;
  font-weight: 600;
}

.pickup-license {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 1.5rem;
}

.empty-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.empty-title {
  font-family: var(--font-heading);
  font-size: 1.35rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.empty-sub {
  color: var(--text-muted);
  max-width: 450px;
  margin: 0 auto 1.5rem;
  line-height: 1.6;
  font-size: 0.92rem;
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

.modal-warning {
  color: var(--text-muted);
  font-size: 0.92rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.payment-success-modal {
  max-width: 520px;
  border: 1px solid rgba(52, 211, 153, 0.3);
  box-shadow: 0 0 60px rgba(52, 211, 153, 0.15);
}
</style>
