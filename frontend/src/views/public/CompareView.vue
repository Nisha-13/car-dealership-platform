<template>
  <div class="compare-page">
    <div class="container">
      <!-- Page Header -->
      <div class="compare-header">
        <div>
          <h1 class="compare-title">Side-by-Side Comparison</h1>
          <p class="compare-sub">Compare engineering specs, pricing, and performance across up to 4 selected vehicles.</p>
        </div>
        <button
          v-if="compareStore.compareList.length"
          @click="compareStore.clearAll"
          class="btn btn-secondary btn-sm"
        >
          ✕ Clear All
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="compareStore.compareList.length === 0" class="glass-panel empty-state">
        <div class="empty-icon">⚖️</div>
        <h3 class="empty-title">No Vehicles Selected</h3>
        <p class="empty-sub">Browse our inventory and click <strong>"+ Compare"</strong> on any vehicle card to add it here.</p>
        <router-link to="/cars" class="btn btn-primary">Browse Vehicles</router-link>
      </div>

      <!-- Compare Table -->
      <div v-else class="compare-scroll-wrapper">
        <div class="compare-table-wrap">
          <!-- Car Headers Row -->
          <div class="compare-row compare-row-header">
            <div class="compare-label-cell compare-row-label"></div>
            <div
              v-for="car in compareStore.compareList"
              :key="car._id"
              class="compare-car-header"
            >
              <button class="remove-car-btn" @click="compareStore.removeCar(car._id)" title="Remove">✕</button>
              <img
                :src="car.images?.[0] || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80'"
                :alt="car.title"
                class="compare-car-img"
              />
              <div class="compare-car-name">{{ car.title }}</div>
              <div class="compare-car-price">${{ car.price?.toLocaleString() }}</div>
            </div>
          </div>

          <!-- Spec Rows -->
          <div class="compare-row" v-for="row in specRows" :key="row.key">
            <div class="compare-label-cell">{{ row.label }}</div>
            <div
              v-for="car in compareStore.compareList"
              :key="car._id"
              class="compare-value-cell"
            >
              {{ getVal(car, row.key) }}
            </div>
          </div>

          <!-- Action Row -->
          <div class="compare-row">
            <div class="compare-label-cell"></div>
            <div
              v-for="car in compareStore.compareList"
              :key="car._id"
              class="compare-value-cell"
            >
              <router-link :to="`/cars/${car._id}`" class="btn btn-primary btn-sm btn-full">
                View & Book
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCompareStore } from '@/stores/compare';

const compareStore = useCompareStore();

const specRows = [
  { label: 'Brand & Year',      key: 'brandYear' },
  { label: 'Horsepower',        key: 'spec.horsepower' },
  { label: '0 – 60 mph',        key: 'spec.acceleration' },
  { label: 'Top Speed',         key: 'spec.topSpeed' },
  { label: 'Drivetrain',        key: 'spec.drivetrain' },
  { label: 'Engine / Motor',    key: 'engine' },
  { label: 'Fuel Type',         key: 'fuelType' },
  { label: 'Transmission',      key: 'transmission' },
  { label: 'Mileage',           key: 'mileage' },
  { label: 'Color',             key: 'color' },
  { label: 'Status',            key: 'status' },
];

function getVal(car, key) {
  if (key === 'brandYear')         return `${car.brand} (${car.year})`;
  if (key === 'spec.horsepower')   return car.specifications?.horsepower  || '—';
  if (key === 'spec.acceleration') return car.specifications?.acceleration || '—';
  if (key === 'spec.topSpeed')     return car.specifications?.topSpeed     || '—';
  if (key === 'spec.drivetrain')   return car.specifications?.drivetrain   || '—';
  if (key === 'mileage')           return car.mileage ? `${car.mileage.toLocaleString()} mi` : '—';
  return car[key] || '—';
}
</script>

<style scoped>
.compare-page {
  padding: 3rem 0 5rem;
  min-height: 70vh;
}

.compare-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2.5rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.compare-title {
  font-family: var(--font-heading);
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  font-weight: 800;
  margin-bottom: 0.4rem;
}

.compare-sub {
  color: var(--text-muted);
  font-size: 0.95rem;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 5rem 2rem;
}
.empty-icon  { font-size: 3.5rem; margin-bottom: 1.25rem; }
.empty-title { font-family: var(--font-heading); font-size: 1.5rem; font-weight: 700; margin-bottom: 0.75rem; }
.empty-sub   { color: var(--text-muted); margin-bottom: 1.75rem; max-width: 500px; margin-left: auto; margin-right: auto; }

/* Compare Scroll — horizontal scroll on small screens */
.compare-scroll-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-surface);
}

.compare-table-wrap {
  min-width: 600px;
}

/* Each Row */
.compare-row {
  display: grid;
  grid-template-columns: 180px repeat(4, 1fr);
  border-bottom: 1px solid var(--border-color);
}

.compare-row:last-child {
  border-bottom: none;
}

/* Dynamic columns based on number of cars */
.compare-row:has(.compare-value-cell:nth-child(2):last-child) {
  grid-template-columns: 180px 1fr;
}
.compare-row:has(.compare-value-cell:nth-child(3):last-child) {
  grid-template-columns: 180px 1fr 1fr;
}
.compare-row:has(.compare-value-cell:nth-child(4):last-child) {
  grid-template-columns: 180px 1fr 1fr 1fr;
}
.compare-row:has(.compare-value-cell:nth-child(5):last-child) {
  grid-template-columns: 180px 1fr 1fr 1fr 1fr;
}

/* Label Cell */
.compare-label-cell {
  padding: 1rem 1.25rem;
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-right: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.01);
}

/* Car Header Cell */
.compare-car-header {
  padding: 1.25rem 1rem;
  border-right: 1px solid var(--border-color);
  position: relative;
  text-align: center;
}

.compare-car-header:last-child {
  border-right: none;
}

.remove-car-btn {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  background: rgba(239,68,68,0.15);
  color: #ef4444;
  border: 1px solid rgba(239,68,68,0.3);
  border-radius: 50%;
  width: 26px;
  height: 26px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
}

.remove-car-btn:hover {
  background: rgba(239,68,68,0.4);
}

.compare-car-img {
  width: 100%;
  height: 130px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  margin-bottom: 0.75rem;
}

.compare-car-name {
  font-family: var(--font-heading);
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  line-height: 1.3;
}

.compare-car-price {
  color: var(--primary);
  font-weight: 800;
  font-size: 1.1rem;
}

/* Value Cell */
.compare-value-cell {
  padding: 0.9rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  border-right: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.compare-value-cell:last-child {
  border-right: none;
}

/* Alternating row bg */
.compare-row:nth-child(even) {
  background: rgba(255,255,255,0.015);
}

@media (max-width: 640px) {
  .compare-row {
    grid-template-columns: 120px repeat(4, minmax(150px, 1fr));
  }
  .compare-label-cell {
    font-size: 0.78rem;
    padding: 0.8rem 0.75rem;
  }
  .compare-value-cell {
    padding: 0.8rem 0.75rem;
    font-size: 0.85rem;
  }
}
</style>
