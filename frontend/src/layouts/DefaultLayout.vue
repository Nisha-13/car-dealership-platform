<template>
  <div class="layout-default">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
    <Toast />
  </div>
</template>

<script setup>
import Navbar from '@/components/common/Navbar.vue';
import Footer from '@/components/common/Footer.vue';
import Toast from '@/components/common/Toast.vue';
import { onMounted } from 'vue';
import { useCarStore } from '@/stores/car';
import { useAuthStore } from '@/stores/auth';
import { useSocket } from '@/composables/useSocket';

const carStore = useCarStore();
const authStore = useAuthStore();
const { initSocketConnection } = useSocket();

onMounted(() => {
  carStore.fetchCategories();
  if (authStore.isAuthenticated) {
    carStore.fetchFavorites();
    initSocketConnection();
  }
});
</script>

<style scoped>
.layout-default {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.main-content {
  flex-grow: 1;
}
</style>
