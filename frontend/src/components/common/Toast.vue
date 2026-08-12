<template>
  <div class="toast-container">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="toast"
      :class="toast.type"
    >
      <span class="toast-icon">
        <template v-if="toast.type === 'success'">✅</template>
        <template v-else-if="toast.type === 'error'">❌</template>
        <template v-else>🔔</template>
      </span>
      <span class="toast-msg">{{ toast.message }}</span>
      <button class="toast-close" @click="removeToast(toast.id)">×</button>
    </div>
  </div>
</template>

<script setup>
import { useToast } from '@/composables/useToast';

const { toasts, removeToast } = useToast();
</script>

<style scoped>
.toast-msg {
  font-size: 0.9rem;
  font-weight: 500;
}
.toast-close {
  background: transparent;
  color: var(--text-muted);
  font-size: 1.2rem;
  margin-left: auto;
  padding: 0 0.25rem;
}
.toast-close:hover {
  color: #fff;
}
</style>
