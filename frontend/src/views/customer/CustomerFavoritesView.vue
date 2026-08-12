<template>
  <div>
    <div style="margin-bottom:2rem;">
      <h2 style="font-family:var(--font-heading); font-size:1.5rem; font-weight:700;">Saved Favorite Vehicles</h2>
      <p style="color:var(--text-muted); font-size:0.9rem;">Your personalized collection of bookmarked luxury vehicles.</p>
    </div>

    <div v-if="carStore.favorites.length" class="cars-grid">
      <CarCard v-for="car in carStore.favorites" :key="car._id" :car="car" />
    </div>

    <div v-else class="glass-panel" style="text-align:center; padding:5rem;">
      <div style="font-size:3rem; margin-bottom:1rem;">♥</div>
      <h3 style="font-family:var(--font-heading); font-size:1.3rem; font-weight:700; margin-bottom:0.5rem;">No Saved Vehicles</h3>
      <p style="color:var(--text-muted); margin-bottom:1.5rem;">Click the heart icon on any vehicle in our showroom to save it here for quick access.</p>
      <router-link to="/cars" class="btn btn-primary">Browse Showroom</router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useCarStore } from '@/stores/car';
import CarCard from '@/components/common/CarCard.vue';

const carStore = useCarStore();

onMounted(() => {
  carStore.fetchFavorites();
});
</script>
