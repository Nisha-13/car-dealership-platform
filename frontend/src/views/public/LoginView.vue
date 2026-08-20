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
      <form @submit.prevent="handleLogin" class="auth-form" novalidate>

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
            :class="{ 'input-error': fieldErrors.email }"
            placeholder="Enter your email"
            autocomplete="email"
            @input="clearFieldError('email')"
          />
          <div v-if="fieldErrors.email" class="field-error-msg">
            ⚠️ {{ fieldErrors.email }}
          </div>
        </div>

        <!-- Password -->
        <div class="form-group">
          <label for="login-password" class="form-label">
            Password
          </label>

          <div class="password-input-wrap">
            <input
              id="login-password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input password-input"
              :class="{ 'input-error': fieldErrors.password }"
              placeholder="Enter your password"
              autocomplete="current-password"
              @input="clearFieldError('password')"
            />
            <button
              type="button"
              class="password-toggle-btn"
              @click="showPassword = !showPassword"
              :title="showPassword ? 'Hide password' : 'Show password'"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
            >
              <!-- Eye Icon (Hidden state -> click to show) -->
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <!-- Eye Off Icon (Visible state -> click to hide) -->
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            </button>
          </div>
          <div v-if="fieldErrors.password" class="field-error-msg">
            ⚠️ {{ fieldErrors.password }}
          </div>
        </div>

        <!-- General Error -->
        <div
          v-if="generalError"
          class="auth-error"
          role="alert"
        >
          {{ generalError }}
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

const showPassword = ref(false);
const loading = ref(false);
const generalError = ref('');
const fieldErrors = ref({});

const clearFieldError = (field) => {
  if (fieldErrors.value[field]) {
    delete fieldErrors.value[field];
  }
  if (generalError.value) {
    generalError.value = '';
  }
};

const handleLogin = async () => {
  fieldErrors.value = {};
  generalError.value = '';

  // Client-side validation
  let hasClientError = false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!form.value.email || !form.value.email.trim()) {
    fieldErrors.value.email = 'Email address is required.';
    hasClientError = true;
  } else if (!emailRegex.test(form.value.email.trim())) {
    fieldErrors.value.email = 'Please enter a valid email address.';
    hasClientError = true;
  }

  if (!form.value.password) {
    fieldErrors.value.password = 'Password is required.';
    hasClientError = true;
  }

  if (hasClientError) return;

  loading.value = true;

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
    // Map backend errors to specific fields
    if (err?.errors && Array.isArray(err.errors)) {
      err.errors.forEach(e => {
        const field = e.path || e.param;
        if (field && (field === 'email' || field === 'password')) {
          fieldErrors.value[field] = e.msg || e.message;
        }
      });
    } else if (err?.message) {
      const msg = err.message.toLowerCase();
      if (msg.includes('email') && !msg.includes('password')) {
        fieldErrors.value.email = err.message;
      } else if (msg.includes('password') && !msg.includes('email')) {
        fieldErrors.value.password = err.message;
      } else if (msg.includes('invalid') || msg.includes('credential') || msg.includes('not found')) {
        fieldErrors.value.email = 'Please check your email address.';
        fieldErrors.value.password = 'Invalid email or password combination.';
      } else {
        generalError.value = err.message;
      }
    } else {
      generalError.value = 'Invalid email or password. Please try again.';
    }

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

.password-input-wrap {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.password-input {
  padding-right: 2.8rem !important;
}

.password-toggle-btn {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: var(--transition);
  z-index: 2;
}

.password-toggle-btn:hover {
  color: var(--primary);
  background: rgba(255, 255, 255, 0.05);
}

.input-error {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.25) !important;
}

.field-error-msg {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: #f87171;
  font-size: 0.82rem;
  font-weight: 500;
  margin-top: 0.35rem;
  line-height: 1.4;
  animation: fieldErrorFade 0.2s ease-in-out;
}

@keyframes fieldErrorFade {
  from { opacity: 0; transform: translateY(-3px); }
  to { opacity: 1; transform: translateY(0); }
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