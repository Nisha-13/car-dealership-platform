<template>
  <div v-if="loading" class="app-loader">
    <!-- Simple & Clean Production Loader -->
    <div class="loader-content">
      <!-- AutoLuxe Branding -->
      <div class="loader-brand">
        <div class="loader-logo">⚡ AUTO<span>LUXE</span></div>
        <div class="loader-subtitle">Premium Car Dealership</div>
      </div>
      
      <!-- Simple Spinner -->
      <div class="loader-spinner">
        <div class="spinner"></div>
      </div>
      
      <!-- Loading Message -->
      <div class="loader-message">
        {{ message || 'Loading...' }}
      </div>
      
      <!-- Simple Progress (optional) -->
      <div v-if="showProgress && progress > 0" class="simple-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="progress-text">{{ progress }}%</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: true
  },
  message: {
    type: String,
    default: ''
  },
  progress: {
    type: Number,
    default: 0
  },
  showProgress: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
/* Simple Production Loader */
.app-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(9,13,22,0.98) 0%, rgba(17,24,39,0.99) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.loader-content {
  text-align: center;
  max-width: 400px;
  padding: 2rem;
}

/* Brand */
.loader-brand {
  margin-bottom: 2rem;
}

.loader-logo {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #3b82f6;
}

.loader-logo span {
  color: #00d4ff;
}

.loader-subtitle {
  font-size: 0.9rem;
  color: #9ca3af;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-weight: 600;
}

/* Spinner */
.loader-spinner {
  margin-bottom: 1.5rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(59, 130, 246, 0.2);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Message */
.loader-message {
  font-size: 0.95rem;
  color: #d1d5db;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

/* Progress Bar */
.simple-progress {
  margin-top: 1rem;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00d4ff, #3b82f6);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.85rem;
  color: #3b82f6;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .loader-content {
    padding: 1.5rem;
  }
  
  .loader-logo {
    font-size: 1.8rem;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
  }
}
</style>