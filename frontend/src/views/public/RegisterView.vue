<template>
  <div class="auth-page">
    <div class="auth-card glass-panel">
      <div class="auth-header">
        <router-link to="/" class="auth-logo">⚡ AUTO<span>LUXE</span></router-link>
        <h1 class="auth-title">Join AutoLuxe</h1>
        <p class="auth-sub">Create your free account and get instant access to test drive bookings, live dealer chat, and a personalized showroom experience.</p>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input
            id="register-name"
            v-model="form.name"
            type="text"
            class="form-input"
            required
            placeholder="John Doe"
            autocomplete="name"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input
            id="register-email"
            v-model="form.email"
            type="email"
            class="form-input"
            required
            placeholder="john@example.com"
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Phone Number</label>
          <input
            id="register-phone"
            v-model="form.phone"
            type="text"
            class="form-input"
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Password</label>
          <input
            id="register-password"
            v-model="form.password"
            type="password"
            class="form-input"
            required
            placeholder="Min 6 characters"
            autocomplete="new-password"
          />
        </div>

        <div v-if="error" class="auth-error">{{ error }}</div>

        <button type="submit" class="btn btn-primary btn-full" :disabled="loading" id="register-submit">
          {{ loading ? 'Creating Account...' : 'Create My Account' }}
        </button>
      </form>

      <p class="auth-footer-link" style="margin-top:1.5rem;">
        Already have an account? <router-link to="/login">Sign In →</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const form = ref({ name: '', email: '', phone: '', password: '' });
const loading = ref(false);
const error = ref('');

const handleRegister = async () => {
  loading.value = true;
  error.value = '';
  try {
    await authStore.register(form.value);
    router.push('/dashboard');
  } catch (err) {
    error.value = err.message || 'Registration failed. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background:
    linear-gradient(135deg, rgba(9,13,22,0.96), rgba(17,24,39,0.98)),
    url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=60') center/cover no-repeat;
}

.auth-card {
  width: 100%;
  max-width: 480px;
  padding: 2.5rem;
  border-radius: var(--radius-lg);
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-logo {
  display: inline-block;
  font-family: var(--font-heading);
  font-size: 1.4rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
}

.auth-logo span { color: var(--primary); }

.auth-title {
  font-family: var(--font-heading);
  font-size: 1.9rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.auth-sub {
  color: var(--text-muted);
  font-size: 0.9rem;
  line-height: 1.6;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.auth-error {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.auth-footer-link {
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.auth-footer-link a {
  color: var(--primary);
  font-weight: 700;
}

@media (max-width: 520px) {
  .auth-card { padding: 1.75rem 1.25rem; }
  .auth-title { font-size: 1.6rem; }
}
</style>
