<template>
  <div class="stat-card">
    <div>
      <div class="form-label">{{ title }}</div>
      <div class="stat-val">{{ value }}</div>
    </div>
    <div class="stat-icon">
      <span>{{ icon || '📊' }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number],
  icon: String
});
</script>
