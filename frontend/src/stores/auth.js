import { defineStore } from 'pinia';
import { loginApi, registerApi, getProfileApi } from '@/api/auth.api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('autoluxe_user')) || null,
    token: localStorage.getItem('autoluxe_token') || '',
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
    isCustomer: (state) => state.user?.role === 'customer'
  },

  actions: {
    async login(credentials) {
      this.loading = true;
      this.error = null;
      try {
        const res = await loginApi(credentials);
        this.token = res.data.token;
        this.user = res.data.user;

        localStorage.setItem('autoluxe_token', this.token);
        localStorage.setItem('autoluxe_user', JSON.stringify(this.user));

        return this.user;
      } catch (err) {
        this.error = err.message || 'Login failed';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async register(userData) {
      this.loading = true;
      this.error = null;
      try {
        const res = await registerApi(userData);
        this.token = res.data.token;
        this.user = res.data.user;

        localStorage.setItem('autoluxe_token', this.token);
        localStorage.setItem('autoluxe_user', JSON.stringify(this.user));

        return this.user;
      } catch (err) {
        this.error = err.message || 'Registration failed';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchProfile() {
      if (!this.token) return;
      try {
        const res = await getProfileApi();
        this.user = res.data;
        localStorage.setItem('autoluxe_user', JSON.stringify(this.user));
      } catch (err) {
        this.logout();
      }
    },

    logout() {
      this.token = '';
      this.user = null;
      localStorage.removeItem('autoluxe_token');
      localStorage.removeItem('autoluxe_user');
    }
  }
});
