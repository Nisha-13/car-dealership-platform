<template>
  <div class="car-card">
    <div class="car-card-img-wrapper">
      <img
        :src="car.images?.[0] || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80'"
        :alt="car.title"
        class="car-card-img"
        loading="lazy"
      />
      <div class="car-card-badge">
        <span class="badge" :class="`badge-${car.status ? car.status.toLowerCase() : 'available'}`">{{ car.status || 'Available' }}</span>
      </div>
      <button class="car-fav-btn" :class="{ active: carStore.isFavorite(car._id) }" @click.prevent="handleFav" :title="carStore.isFavorite(car._id) ? 'Remove Favorite' : 'Save Favorite'">
        {{ carStore.isFavorite(car._id) ? '♥' : '♡' }}
      </button>
    </div>

    <div class="car-card-body">
      <div class="car-card-meta">{{ car.brand }} · {{ car.year }}</div>
      <h3 class="car-card-title">{{ car.title }}</h3>
      <div class="car-card-price">${{ car.price?.toLocaleString() }}</div>

      <div class="car-card-specs">
        <span class="spec-item">⚡ {{ car.fuelType }}</span>
        <span class="spec-item">⚙️ {{ car.transmission }}</span>
        <span class="spec-item">📍 {{ car.mileage?.toLocaleString() }} mi</span>
      </div>

      <div class="car-card-footer">
        <router-link :to="`/cars/${car._id}`" class="btn btn-primary btn-sm" style="flex:1; text-align:center;">
          View Details
        </router-link>
        <button @click="handleCompare" class="btn btn-secondary btn-sm" :class="{ 'btn-accent': compareStore.isInCompare(car._id) }">
          {{ compareStore.isInCompare(car._id) ? '✓' : '+' }} Compare
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCarStore } from '@/stores/car';
import { useCompareStore } from '@/stores/compare';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/composables/useToast';
import { useRouter } from 'vue-router';

const props = defineProps({ car: { type: Object, required: true } });

const carStore = useCarStore();
const compareStore = useCompareStore();
const authStore = useAuthStore();
const { showToast } = useToast();
const router = useRouter();

const handleFav = async () => {
  if (!authStore.isAuthenticated) {
    showToast('Please login to save favorites.', 'info');
    return router.push('/login');
  }
  const res = await carStore.toggleFavorite(props.car._id);
  showToast(res?.isFavorite ? 'Saved to favorites!' : 'Removed from favorites.', 'success');
};

const handleCompare = () => {
  if (compareStore.isInCompare(props.car._id)) {
    compareStore.removeCar(props.car._id);
    showToast('Removed from comparison.', 'info');
  } else {
    if (compareStore.compareList.length >= 4) {
      showToast('Max 4 vehicles can be compared.', 'error');
      return;
    }
    compareStore.addCar(props.car);
    showToast('Added to compare! Visit Compare page.', 'success');
  }
};
</script>

<style scoped>
.car-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: var(--transition);
  display: flex;
  flex-direction: column;
}

.car-card:hover {
  transform: translateY(-6px);
  border-color: var(--border-highlight);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.car-card-img-wrapper {
  position: relative;
  width: 100%;
  height: 210px;
  overflow: hidden;
  background: #000;
  flex-shrink: 0;
}

.car-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.car-card:hover .car-card-img {
  transform: scale(1.06);
}

.car-card-badge {
  position: absolute;
  top: 0.85rem;
  left: 0.85rem;
}

.car-fav-btn {
  position: absolute;
  top: 0.85rem;
  right: 0.85rem;
  background: rgba(0, 0, 0, 0.55);
  border: 1px solid rgba(255,255,255,0.2);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: var(--transition);
}

.car-fav-btn:hover,
.car-fav-btn.active {
  background: rgba(239, 68, 68, 0.85);
  border-color: transparent;
}

.car-card-body {
  padding: 1.25rem 1.4rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.car-card-meta {
  font-size: 0.8rem;
  color: var(--text-dim);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.35rem;
}

.car-card-title {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.car-card-price {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--primary);
  margin-bottom: 1rem;
}

.car-card-specs {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 1.1rem;
  font-size: 0.82rem;
  color: var(--text-muted);
  flex-wrap: wrap;
}

.car-card-footer {
  margin-top: auto;
  display: flex;
  gap: 0.6rem;
}
</style>
