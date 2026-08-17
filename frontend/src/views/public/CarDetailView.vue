<template>
  <div class="detail-page" v-if="car">
    <div class="container">
      <!-- Header -->
      <div class="detail-header">
        <div class="detail-header-left">
          <div class="detail-header-meta">
            <span class="badge" :class="getBadgeClass(car.status)">{{ car.status || 'Available' }}</span>
            <span class="detail-brand-year">{{ car.brand }} · {{ car.year }}</span>
          </div>
          <h1 class="detail-title">{{ car.title }}</h1>
        </div>
        <div class="detail-header-right">
          <div class="detail-price">${{ car.price ? car.price.toLocaleString() : 'N/A' }}</div>
          <div class="detail-action-row">
            <button @click="handleFavorite" class="btn btn-secondary btn-sm">{{ isFav ? '♥ Saved' : '♡ Save' }}</button>
            <button @click="toggleCompare" class="btn btn-sm" :class="inCompare ? 'btn-accent' : 'btn-secondary'">{{ inCompare ? '✓ In Compare' : '+ Compare' }}</button>
          </div>
        </div>
      </div>

      <!-- Gallery + Booking Grid -->
      <div class="detail-main-grid">
        <!-- Gallery -->
        <div class="detail-gallery">
          <div class="gallery-main">
            <img :src="activeImage" :alt="car.title" class="gallery-main-img" />
          </div>
          <div class="gallery-thumbs" v-if="car.images && car.images.length > 1">
            <img
              v-for="(img, idx) in car.images"
              :key="idx"
              :src="img"
              @click="activeImage = img"
              class="gallery-thumb"
              :class="{ active: activeImage === img }"
              loading="lazy"
            />
          </div>
        </div>

        <!-- Action Card: Tabbed between Reservation and VIP Test Drive -->
        <div class="glass-panel booking-card">
          <!-- Booking Mode Tabs -->
          <div class="card-mode-tabs">
            <button
              class="card-mode-btn"
              :class="{ active: activeBookingTab === 'reserve' }"
              @click="activeBookingTab = 'reserve'"
            >
              🚗 Reserve Car
            </button>
            <button
              class="card-mode-btn"
              :class="{ active: activeBookingTab === 'testDrive' }"
              @click="activeBookingTab = 'testDrive'"
            >
              🏎️ VIP Test Drive
            </button>
          </div>

          <!-- TAB 1: VEHICLE RESERVATION -->
          <div v-if="activeBookingTab === 'reserve'" class="tab-content">
            <div v-if="car.status !== 'Available'" class="status-alert-box" :class="`alert-${car.status.toLowerCase()}`">
              <div class="alert-icon">⚠️</div>
              <div>
                <strong>Vehicle Currently {{ car.status }}</strong>
                <p>This car cannot be reserved right now. You can still send an inquiry to our sales team.</p>
              </div>
            </div>

            <template v-else>
              <h3 class="booking-title">Reserve This Vehicle</h3>
              <p class="booking-sub">Lock in exclusive showroom hold for your requested dates.</p>

              <form @submit.prevent="handleReserveCar">
                <div class="form-row-2">
                  <div class="form-group">
                    <label class="form-label">Start Date</label>
                    <input
                      v-model="reserveForm.startDate"
                      type="date"
                      :min="todayDateStr"
                      class="form-input"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label class="form-label">End Date</label>
                    <input
                      v-model="reserveForm.endDate"
                      type="date"
                      :min="reserveForm.startDate || todayDateStr"
                      class="form-input"
                      required
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Driver's License / ID Number</label>
                  <input
                    v-model="reserveForm.driverLicense"
                    type="text"
                    placeholder="e.g. DL-884920-NY"
                    class="form-input"
                    required
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Contact Phone</label>
                  <input
                    v-model="reserveForm.contactPhone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    class="form-input"
                    required
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Special Requests / Notes</label>
                  <textarea
                    v-model="reserveForm.customerNotes"
                    class="form-textarea"
                    rows="2"
                    placeholder="Concierge delivery, detailing preference, etc."
                  ></textarea>
                </div>

                <!-- Reservation Hold Summary -->
                <div class="deposit-summary-box" v-if="calculatedDays > 0">
                  <div class="summary-line">
                    <span>Estimated Hold Duration</span>
                    <strong>{{ calculatedDays }} {{ calculatedDays === 1 ? 'Day' : 'Days' }}</strong>
                  </div>
                  <div class="summary-line">
                    <span>Vehicle Price</span>
                    <strong style="color:var(--primary);">${{ car.price?.toLocaleString() || '—' }}</strong>
                  </div>
                  <div class="summary-note">
                    Vehicle status will automatically lock as <strong>Reserved</strong> upon confirmation.
                  </div>
                </div>

                <button
                  type="submit"
                  class="btn btn-primary btn-full btn-reserve"
                  :disabled="reservationLoading"
                >
                  <span v-if="reservationLoading">⟳ Processing Reservation...</span>
                  <span v-else>🏎️ Confirm Reservation Hold</span>
                </button>
              </form>
            </template>
          </div>

          <!-- TAB 2: VIP TEST DRIVE -->
          <div v-else-if="activeBookingTab === 'testDrive'" class="tab-content">
            <h3 class="booking-title">Book a VIP Test Drive</h3>
            <p class="booking-sub">Schedule a private showroom experience with an AutoLuxe specialist.</p>

            <form @submit.prevent="handleBookTestDrive">
              <div class="form-group">
                <label class="form-label">Preferred Date</label>
                <input v-model="testDriveForm.preferredDate" :min="todayDateStr" type="date" class="form-input" required />
              </div>
              <div class="form-group">
                <label class="form-label">Preferred Time Slot</label>
                <select v-model="testDriveForm.preferredTime" class="form-select" required>
                  <option value="09:30 AM">09:30 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Notes / Preferences</label>
                <textarea v-model="testDriveForm.notes" class="form-textarea" rows="2" placeholder="Trade-in, financing, etc."></textarea>
              </div>
              <button type="submit" class="btn btn-primary btn-full" :disabled="bookingLoading">
                {{ bookingLoading ? 'Booking...' : '🏎️ Confirm Test Drive Booking' }}
              </button>
            </form>
          </div>

          <div class="booking-divider"></div>
          <button @click="showInquiryModal = true" class="btn btn-secondary btn-full">✉️ Send Inquiry to Dealer</button>
        </div>
      </div>

      <!-- Specs + Description -->
      <div class="detail-specs-grid">
        <div class="glass-panel specs-card">
          <h3 class="specs-title">Technical Specifications</h3>
          <div class="specs-table">
            <div class="spec-row" v-for="spec in specRows" :key="spec.label">
              <span class="spec-label">{{ spec.label }}</span>
              <span class="spec-value">{{ spec.value }}</span>
            </div>
          </div>
        </div>
        <div class="glass-panel specs-card">
          <h3 class="specs-title">Vehicle Description</h3>
          <p class="detail-description">{{ car.description }}</p>
          <h4 class="features-title" v-if="car.features?.length">Key Highlights &amp; Packages</h4>
          <div class="features-grid" v-if="car.features?.length">
            <div v-for="(f, i) in car.features" :key="i" class="feature-item">
              <span class="feature-check">✓</span> {{ f }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Inquiry Modal -->
    <div v-if="showInquiryModal" class="modal-backdrop" @click.self="showInquiryModal = false">
      <div class="glass-panel modal-box">
        <div class="modal-header">
          <h3 class="modal-title">Inquire About {{ car.title }}</h3>
          <button @click="showInquiryModal = false" class="modal-close">✕</button>
        </div>
        <form @submit.prevent="handleSendInquiry">
          <div class="form-group">
            <label class="form-label">Your Name</label>
            <input v-model="inquiryForm.name" type="text" class="form-input" required />
          </div>
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input v-model="inquiryForm.email" type="email" class="form-input" required />
          </div>
          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <input v-model="inquiryForm.phone" type="text" class="form-input" required />
          </div>
          <div class="form-group">
            <label class="form-label">Your Message</label>
            <textarea v-model="inquiryForm.message" class="form-textarea" rows="3" required placeholder="I am interested in financing rates..."></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-full">Submit Inquiry</button>
        </form>
      </div>
    </div>
  </div>

  <div v-else-if="carStore.loading" class="container detail-loading">
    <div style="font-size:2.5rem; margin-bottom:1rem;">⟳</div>
    <p style="color:var(--text-muted);">Loading vehicle profile...</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCarStore } from '@/stores/car';
import { useCompareStore } from '@/stores/compare';
import { useAuthStore } from '@/stores/auth';
import { bookTestDriveApi } from '@/api/testDrive.api';
import { createInquiryApi } from '@/api/inquiry.api';
import { createReservationApi } from '@/api/reservation.api';
import { useToast } from '@/composables/useToast';

const carStore = useCarStore();
const compareStore = useCompareStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const { showToast } = useToast();

const car = computed(() => carStore.currentCar);
const activeImage = ref('');
const activeBookingTab = ref('reserve');
const showInquiryModal = ref(false);
const bookingLoading = ref(false);
const reservationLoading = ref(false);

const todayDateStr = new Date().toISOString().split('T')[0];

const defaultEndDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString().split('T')[0];
};

const reserveForm = ref({
  startDate: todayDateStr,
  endDate: defaultEndDate(),
  contactPhone: authStore.user?.phone || '',
  driverLicense: '',
  customerNotes: ''
});

const testDriveForm = ref({
  preferredDate: '',
  preferredTime: '11:00 AM',
  notes: ''
});

const inquiryForm = ref({
  name: authStore.user?.name || '',
  email: authStore.user?.email || '',
  phone: authStore.user?.phone || '',
  message: ''
});

const isFav = computed(() => car.value && carStore.isFavorite(car.value._id));
const inCompare = computed(() => car.value && compareStore.isInCompare(car.value._id));

const calculatedDays = computed(() => {
  if (!reserveForm.value.startDate || !reserveForm.value.endDate) return 0;
  const s = new Date(reserveForm.value.startDate);
  const e = new Date(reserveForm.value.endDate);
  if (isNaN(s.getTime()) || isNaN(e.getTime()) || e < s) return 0;
  return Math.max(1, Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1);
});

const specRows = computed(() => [
  { label: 'Horsepower',          value: car.value?.specifications?.horsepower  || '—' },
  { label: 'Acceleration (0–60)', value: car.value?.specifications?.acceleration || '—' },
  { label: 'Top Speed',           value: car.value?.specifications?.topSpeed     || '—' },
  { label: 'Drivetrain',          value: car.value?.specifications?.drivetrain   || '—' },
  { label: 'Engine / Motor',      value: car.value?.engine        || '—' },
  { label: 'Fuel / Powertrain',   value: car.value?.fuelType      || '—' },
  { label: 'Transmission',        value: car.value?.transmission  || '—' },
  { label: 'Exterior Color',      value: car.value?.color         || '—' },
  { label: 'Mileage',             value: car.value?.mileage ? `${car.value.mileage.toLocaleString()} mi` : '—' },
]);

const getBadgeClass = (status) => {
  switch (status) {
    case 'Available': return 'badge-available';
    case 'Reserved': return 'badge-reserved';
    case 'Sold': return 'badge-sold';
    default: return 'badge-available';
  }
};

const handleFavorite = async () => {
  if (!authStore.isAuthenticated) return router.push('/login');
  const res = await carStore.toggleFavorite(car.value._id);
  showToast(res.isFavorite ? 'Saved to favorites!' : 'Removed from favorites.', 'success');
};

const toggleCompare = () => {
  if (inCompare.value) {
    compareStore.removeCar(car.value._id);
    showToast('Removed from comparison.', 'info');
  } else {
    compareStore.addCar(car.value);
    showToast('Added to comparison matrix!', 'success');
  }
};

const handleReserveCar = async () => {
  if (!authStore.isAuthenticated) {
    showToast('Please sign in to reserve this vehicle.', 'info');
    return router.push({ name: 'login', query: { redirect: route.fullPath } });
  }

  if (car.value.status !== 'Available') {
    return showToast(`This vehicle is currently ${car.value.status} and cannot be reserved.`, 'error');
  }

  reservationLoading.value = true;
  try {
    await createReservationApi({
      carId: car.value._id,
      ...reserveForm.value
    });
    showToast('🎉 Reservation confirmed! Vehicle status marked as Reserved.', 'success');
    // Refresh vehicle status in store
    await carStore.fetchCarById(car.value._id);
    router.push('/dashboard/reservations');
  } catch (err) {
    showToast(err.response?.data?.message || err.message || 'Failed to submit reservation.', 'error');
  } finally {
    reservationLoading.value = false;
  }
};

const handleBookTestDrive = async () => {
  if (!authStore.isAuthenticated) {
    showToast('Please login to book a test drive.', 'info');
    return router.push({ name: 'login', query: { redirect: route.fullPath } });
  }
  bookingLoading.value = true;
  try {
    await bookTestDriveApi({ carId: car.value._id, ...testDriveForm.value });
    showToast('🚀 Test drive booking requested! Dealer notified live.', 'success');
    router.push('/dashboard/test-drives');
  } catch (err) {
    showToast(err.message || 'Error booking test drive.', 'error');
  } finally {
    bookingLoading.value = false;
  }
};

const handleSendInquiry = async () => {
  try {
    await createInquiryApi({ carId: car.value._id, ...inquiryForm.value });
    showToast('Inquiry sent! A dealer will contact you shortly.', 'success');
    showInquiryModal.value = false;
    inquiryForm.value.message = '';
  } catch (err) {
    showToast(err.message || 'Error submitting inquiry.', 'error');
  }
};

onMounted(async () => {
  const loadedCar = await carStore.fetchCarById(route.params.id);
  if (loadedCar?.images?.length) activeImage.value = loadedCar.images[0];
  if (authStore.user?.phone) {
    reserveForm.value.contactPhone = authStore.user.phone;
  }
});
</script>

<style scoped>
.detail-page { padding: 3rem 0 5rem; }
.detail-loading { padding: 6rem 1.5rem; text-align: center; }

/* ── Header ── */
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}
.detail-header-meta { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
.detail-brand-year  { color: var(--text-muted); font-size: 0.9rem; font-weight: 600; }
.detail-title       { font-family: var(--font-heading); font-size: clamp(1.6rem, 4vw, 2.5rem); font-weight: 800; line-height: 1.1; }
.detail-header-right { text-align: right; flex-shrink: 0; }
.detail-price        { font-size: clamp(1.6rem, 4vw, 2.4rem); font-weight: 800; color: var(--primary); margin-bottom: 0.75rem; }
.detail-action-row   { display: flex; gap: 0.65rem; justify-content: flex-end; flex-wrap: wrap; }

/* ── Main Grid ── */
.detail-main-grid {
  display: grid;
  grid-template-columns: 1fr 390px;
  gap: 2rem;
  margin-bottom: 2.5rem;
  align-items: start;
}

/* ── Gallery ── */
.gallery-main {
  width: 100%;
  height: 440px;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: #000;
  border: 1px solid var(--border-color);
  margin-bottom: 1rem;
}
.gallery-main-img { width: 100%; height: 100%; object-fit: cover; }
.gallery-thumbs { display: flex; gap: 0.75rem; overflow-x: auto; padding-bottom: 0.5rem; }
.gallery-thumb {
  width: 90px; height: 64px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  cursor: pointer;
  border: 2px solid transparent;
  flex-shrink: 0;
  transition: var(--transition);
  opacity: 0.65;
}
.gallery-thumb.active, .gallery-thumb:hover { border-color: var(--primary); opacity: 1; }

/* ── Booking Card ── */
.booking-card { padding: 1.5rem; position: sticky; top: 88px; }

/* Card Mode Tabs */
.card-mode-tabs {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 0.25rem;
  margin-bottom: 1.25rem;
  gap: 0.25rem;
}
.card-mode-btn {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-weight: 700;
  font-size: 0.85rem;
  padding: 0.5rem 0.25rem;
  border-radius: 4px;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
}
.card-mode-btn.active {
  background: var(--primary);
  color: #000;
}

.tab-content {
  display: flex;
  flex-direction: column;
}

.booking-title  { font-family: var(--font-heading); font-size: 1.2rem; font-weight: 700; margin-bottom: 0.35rem; }
.booking-sub    { color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1.15rem; line-height: 1.4; }
.booking-divider{ border-top: 1px solid var(--border-color); margin: 1.25rem 0; }

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.deposit-summary-box {
  background: rgba(212, 160, 23, 0.08);
  border: 1px solid rgba(212, 160, 23, 0.25);
  border-radius: var(--radius-sm);
  padding: 0.85rem;
  margin: 1rem 0;
}
.summary-line {
  display: flex;
  justify-content: space-between;
  font-size: 0.88rem;
  margin-bottom: 0.35rem;
}
.summary-line:last-child { margin-bottom: 0; }
.summary-note {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
  line-height: 1.4;
}

.btn-reserve {
  font-weight: 800;
  letter-spacing: 0.02em;
}

.status-alert-box {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: var(--radius-sm);
  margin-bottom: 1rem;
  font-size: 0.88rem;
}
.status-alert-box.alert-reserved {
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.35);
  color: #fbbf24;
}
.status-alert-box.alert-sold {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.35);
  color: #f87171;
}
.alert-icon { font-size: 1.25rem; flex-shrink: 0; }

/* ── Specs Grid ── */
.detail-specs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
.specs-card { padding: 2rem; }
.specs-title {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
}
.specs-table  { display: flex; flex-direction: column; }
.spec-row     { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid var(--border-color); gap: 1rem; }
.spec-row:last-child { border-bottom: none; }
.spec-label   { color: var(--text-muted); font-size: 0.87rem; font-weight: 600; }
.spec-value   { font-weight: 700; font-size: 0.93rem; text-align: right; }
.detail-description { color: var(--text-muted); line-height: 1.75; margin-bottom: 1.5rem; font-size: 0.95rem; }
.features-title { font-family: var(--font-heading); font-size: 1.05rem; font-weight: 700; margin-bottom: 0.85rem; }
.features-grid  { display: grid; grid-template-columns: repeat(auto-fill, minmax(175px, 1fr)); gap: 0.6rem; }
.feature-item   { font-size: 0.88rem; color: var(--text-muted); display: flex; align-items: flex-start; gap: 0.4rem; }
.feature-check  { color: var(--primary); font-weight: 800; flex-shrink: 0; }

/* ── Modal ── */
.modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.75);
  backdrop-filter: blur(8px);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.modal-box { width: 100%; max-width: 500px; padding: 2rem; background: var(--bg-surface); max-height: 90vh; overflow-y: auto; }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.modal-title  { font-family: var(--font-heading); font-size: 1.2rem; font-weight: 700; }
.modal-close  {
  background: rgba(255,255,255,0.07);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  width: 32px; height: 32px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  font-size: 0.85rem;
  transition: var(--transition);
}
.modal-close:hover { background: rgba(239,68,68,0.2); border-color: #ef4444; color: #ef4444; }

/* ── Badges ── */
.badge-available {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}
.badge-reserved {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}
.badge-sold {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

/* ── RESPONSIVE ── */
@media (max-width: 960px) {
  .detail-main-grid   { grid-template-columns: 1fr; }
  .booking-card       { position: static; }
  .gallery-main       { height: 320px; }
  .detail-specs-grid  { grid-template-columns: 1fr; }
}

@media (max-width: 600px) {
  .detail-page        { padding: 1.5rem 0 3rem; }
  .detail-header      { flex-direction: column; align-items: flex-start; }
  .detail-header-right{ text-align: left; width: 100%; }
  .detail-price       { font-size: 1.8rem; }
  .detail-action-row  { justify-content: flex-start; }
  .gallery-main       { height: 240px; }
  .gallery-thumb      { width: 72px; height: 52px; }
  .specs-card         { padding: 1.25rem; }
  .features-grid      { grid-template-columns: 1fr; }
  .modal-box          { padding: 1.5rem 1.25rem; }
}
</style>
