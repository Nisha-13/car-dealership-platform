<template>
  <div class="auth-page">
    <div class="auth-card glass-panel">
      <div class="auth-header">
        <router-link to="/" class="auth-logo">⚡ AUTO<span>LUXE</span></router-link>
        <h1 class="auth-title">Welcome Back</h1>
        <p class="auth-sub">Sign in to your AutoLuxe account to access your personalized showroom dashboard.</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input
            id="login-email"
            v-model="form.email"
            type="email"
            class="form-input"
            required
            placeholder="john@example.com"
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Password</label>
          <input
            id="login-password"
            v-model="form.password"
            type="password"
            class="form-input"
            required
            placeholder="••••••••"
            autocomplete="current-password"
          />
        </div>

        <div v-if="error" class="auth-error">{{ error }}</div>

        <button type="submit" class="btn btn-primary btn-full" :disabled="loading" id="login-submit">
          {{ loading ? 'Signing In...' : 'Sign In to Dashboard' }}
        </button>
      </form>

      <div class="auth-divider"><span>Quick Fill Demo Credentials</span></div>

      <div class="demo-btns">
        <button @click="fillAdmin" class="demo-btn">
          <span>👑 Admin / Dealer</span>
          <span class="demo-email">admin@autoluxe.com</span>
        </button>
        <button @click="fillCustomer" class="demo-btn">
          <span>👤 Customer</span>
          <span class="demo-email">john@example.com</span>
        </button>
      </div>

      <p class="auth-footer-link">
        New to AutoLuxe? <router-link to="/register">Create your free account →</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const form = ref({ email: '', password: '' });
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    await authStore.login({
      email: form.value.email,
      password: form.value.password
    });
    const redirectTo = route.query.redirect || (authStore.isAdmin ? '/admin/dashboard' : '/dashboard');
    router.push(redirectTo);
  } catch (err) {
    error.value = err.message || 'Invalid email or password. Please try again.';
  } finally {
    loading.value = false;
  }
};

const fillAdmin = () => {
  form.value = { email: 'admin@autoluxe.com', password: 'Admin123!' };
};

const fillCustomer = () => {
  form.value = { email: 'john@example.com', password: 'Customer123!' };
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
    linear-gradient(135deg, rgba(9,13,22,0.96) 0%, rgba(17,24,39,0.98) 100%),
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

.auth-divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0 1rem;
}

.auth-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--border-color);
}

.auth-divider span {
  background: var(--bg-surface);
  position: relative;
  padding: 0 1rem;
  font-size: 0.8rem;
  color: var(--text-dim);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.demo-btns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.demo-btn {
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 0.85rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  transition: var(--transition);
  font-family: inherit;
}

.demo-btn:hover {
  border-color: var(--primary);
  background: var(--primary-glow);
}

.demo-btn span:first-child {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-main);
}

.demo-email {
  font-size: 0.75rem !important;
  color: var(--text-muted) !important;
  font-family: monospace;
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
  .demo-btns { grid-template-columns: 1fr; }
}
</style>
