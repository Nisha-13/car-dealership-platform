<template>
  <div class="auth-page">
    <div class="auth-card glass-panel">

      <!-- Header -->
      <div class="auth-header">
        <router-link to="/" class="auth-logo">
          ⚡ AUTO<span>LUXE</span>
        </router-link>

        <h1 class="auth-title">Welcome Back</h1>

        <p class="auth-sub">
          Sign in to your AutoLuxe account to access your personalized
          showroom dashboard.
        </p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="auth-form">

        <!-- Email -->
        <div class="form-group">
          <label for="login-email" class="form-label">
            Email Address
          </label>

          <input
            id="login-email"
            v-model="form.email"
            type="email"
            class="form-input"
            required
            placeholder="Enter your email"
            autocomplete="email"
          />
        </div>

        <!-- Password -->
        <div class="form-group">
          <label for="login-password" class="form-label">
            Password
          </label>

          <input
            id="login-password"
            v-model="form.password"
            type="password"
            class="form-input"
            required
            placeholder="Enter your password"
            autocomplete="current-password"
          />
        </div>

        <!-- Error -->
        <div
          v-if="error"
          class="auth-error"
          role="alert"
        >
          {{ error }}
        </div>

        <!-- Login Button -->
        <button
          id="login-submit"
          type="submit"
          class="btn btn-primary btn-full"
          :disabled="loading"
        >
          {{ loading ? 'Signing In...' : 'Sign In to Dashboard' }}
        </button>
      </form>

      <!-- Register -->
      <p class="auth-footer-link">
        New to AutoLuxe?
        <router-link to="/register">
          Create your free account →
        </router-link>
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

const form = ref({
  email: '',
  password: ''
});

const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  loading.value = true;
  error.value = '';

  try {
    await authStore.login({
      email: form.value.email.trim(),
      password: form.value.password
    });

    const redirectTo =
      route.query.redirect ||
      (authStore.isAdmin
        ? '/admin/dashboard'
        : '/dashboard');

    await router.push(redirectTo);

  } catch (err) {
    error.value =
      err?.message ||
      'Invalid email or password. Please try again.';

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
    linear-gradient(
      135deg,
      rgba(9, 13, 22, 0.96) 0%,
      rgba(17, 24, 39, 0.98) 100%
    ),
    url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=60')
      center / cover no-repeat;
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
  margin-bottom: 1.5rem;

  font-family: var(--font-heading);
  font-size: 1.4rem;
  font-weight: 800;

  text-decoration: none;
}

.auth-logo span {
  color: var(--primary);
}

.auth-title {
  margin-bottom: 0.5rem;

  font-family: var(--font-heading);
  font-size: 1.9rem;
  font-weight: 800;
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
  margin-bottom: 0.5rem;
  padding: 0.75rem 1rem;

  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--radius-sm);

  color: #f87171;
  font-size: 0.9rem;
  line-height: 1.5;
}

.auth-footer-link {
  margin-top: 1.5rem;

  text-align: center;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.auth-footer-link a {
  color: var(--primary);
  font-weight: 700;
  text-decoration: none;
}

.auth-footer-link a:hover {
  text-decoration: underline;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

@media (max-width: 520px) {
  .auth-page {
    padding: 1rem;
  }

  .auth-card {
    padding: 1.75rem 1.25rem;
  }

  .auth-title {
    font-size: 1.6rem;
  }
}
</style>