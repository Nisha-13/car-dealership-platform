<template>
  <div class="auth-page">
    <div class="auth-card glass-panel">
      <div class="auth-header">
        <router-link to="/" class="auth-logo">⚡ AUTO<span>LUXE</span></router-link>
        <h1 class="auth-title">Join AutoLuxe</h1>
        <p class="auth-sub">Create your free account and get instant access to test drive bookings, live dealer chat, and a personalized showroom experience.</p>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form" novalidate>
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input
            id="register-name"
            v-model="form.name"
            type="text"
            class="form-input"
            :class="{ 'input-error': fieldErrors.name }"
            placeholder="John Doe"
            autocomplete="name"
            @input="clearFieldError('name')"
          />
          <div v-if="fieldErrors.name" class="field-error-msg">
            ⚠️ {{ fieldErrors.name }}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input
            id="register-email"
            v-model="form.email"
            type="email"
            class="form-input"
            :class="{ 'input-error': fieldErrors.email }"
            placeholder="john@example.com"
            autocomplete="email"
            @input="clearFieldError('email')"
          />
          <div v-if="fieldErrors.email" class="field-error-msg">
            ⚠️ {{ fieldErrors.email }}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Phone Number (Optional)</label>
          <input
            id="register-phone"
            v-model="form.phone"
            type="text"
            class="form-input"
            :class="{ 'input-error': fieldErrors.phone }"
            placeholder="+1 (555) 000-0000"
            @input="clearFieldError('phone')"
          />
          <div v-if="fieldErrors.phone" class="field-error-msg">
            ⚠️ {{ fieldErrors.phone }}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Password</label>
          <div class="password-input-wrap">
            <input
              id="register-password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input password-input"
              :class="{ 'input-error': fieldErrors.password }"
              placeholder="Min 6 characters"
              autocomplete="new-password"
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

        <div v-if="generalError" class="auth-error">{{ generalError }}</div>

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

const handleRegister = async () => {
  fieldErrors.value = {};
  generalError.value = '';

  // Client-side validation
  let hasClientError = false;

  if (!form.value.name || !form.value.name.trim()) {
    fieldErrors.value.name = 'Full name is required.';
    hasClientError = true;
  } else if (form.value.name.trim().length < 2) {
    fieldErrors.value.name = 'Full name must be at least 2 characters.';
    hasClientError = true;
  }

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
  } else if (form.value.password.length < 6) {
    fieldErrors.value.password = 'Password must be at least 6 characters long.';
    hasClientError = true;
  }

  if (hasClientError) return;

  loading.value = true;
  try {
    await authStore.register({
      name: form.value.name.trim(),
      email: form.value.email.trim(),
      phone: form.value.phone ? form.value.phone.trim() : '',
      password: form.value.password
    });
    router.push('/dashboard');
  } catch (err) {
    // Map backend express-validator or mongoose/service errors
    if (err?.errors && Array.isArray(err.errors)) {
      err.errors.forEach(e => {
        const field = e.path || e.param;
        if (field && ['name', 'email', 'phone', 'password'].includes(field)) {
          fieldErrors.value[field] = e.msg || e.message;
        }
      });
    } else if (err?.message) {
      const msg = err.message.toLowerCase();
      if (msg.includes('email') || msg.includes('already exists') || msg.includes('already registered')) {
        fieldErrors.value.email = err.message;
      } else if (msg.includes('password')) {
        fieldErrors.value.password = err.message;
      } else if (msg.includes('name')) {
        fieldErrors.value.name = err.message;
      } else if (msg.includes('phone')) {
        fieldErrors.value.phone = err.message;
      } else {
        generalError.value = err.message;
      }
    } else {
      generalError.value = 'Registration failed. Please try again.';
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
