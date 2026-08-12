<template>
  <!-- Simple Production Loader -->
  <Loader 
    :loading="isLoading" 
    :message="loadingMessage"
    :progress="loadingProgress"
    :show-progress="showProgress"
  />
  
  <!-- Main App Content -->
  <div v-show="!isLoading">
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Loader from '@/components/common/Loader.vue';

// Simple loader state
const isLoading = ref(true);
const loadingMessage = ref('Loading AutoLuxe...');
const loadingProgress = ref(0);
const showProgress = ref(false);

onMounted(() => {
  // Simple loading simulation
  // For initial app load only
  setTimeout(() => {
    loadingMessage.value = 'Initializing Application';
    loadingProgress.value = 30;
    showProgress.value = true;
  }, 300);
  
  setTimeout(() => {
    loadingMessage.value = 'Loading Vehicle Catalog';
    loadingProgress.value = 60;
  }, 800);
  
  setTimeout(() => {
    loadingMessage.value = 'Finalizing Setup';
    loadingProgress.value = 100;
  }, 1300);
  
  // Hide loader after 1.8 seconds
  setTimeout(() => {
    isLoading.value = false;
  }, 1800);
});
</script>

<style scoped>
/* Smooth transition */
.app-content {
  transition: opacity 0.3s ease;
}
</style>