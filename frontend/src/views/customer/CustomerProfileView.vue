<template>
  <div>
    <div style="margin-bottom:2rem;">
      <h2 style="font-family:var(--font-heading); font-size:1.5rem; font-weight:700;">Profile & Account Settings</h2>
      <p style="color:var(--text-muted); font-size:0.9rem;">Manage personal contact information and communication preferences.</p>
    </div>

    <div class="glass-panel" style="padding:2rem; max-width:600px;">
      <form @submit.prevent="handleSave">
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input v-model="form.name" type="text" class="form-input" required />
        </div>

        <div class="form-group">
          <label class="form-label">Email Address (Read-only)</label>
          <input :value="authStore.user?.email" type="email" class="form-input" disabled style="opacity:0.6;" />
        </div>

        <div class="form-group">
          <label class="form-label">Phone Number</label>
          <input v-model="form.phone" type="text" class="form-input" placeholder="+1 (555) 000-0000" />
        </div>

        <hr style="border:none; border-top:1px solid var(--border-color); margin:1.5rem 0;" />

        <h4 style="font-family:var(--font-heading); font-size:1.1rem; font-weight:700; margin-bottom:1rem;">Real-Time Notification Preferences</h4>
        <div style="display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1.5rem;">
          <label style="display:flex; align-items:center; gap:0.75rem; font-size:0.95rem; cursor:pointer;">
            <input type="checkbox" v-model="form.notificationPreferences.inApp" style="accent-color:var(--primary);" />
            In-App Socket.IO Real-Time Popups
          </label>
          <label style="display:flex; align-items:center; gap:0.75rem; font-size:0.95rem; cursor:pointer;">
            <input type="checkbox" v-model="form.notificationPreferences.email" style="accent-color:var(--primary);" />
            BullMQ Background Email Notifications
          </label>
          <label style="display:flex; align-items:center; gap:0.75rem; font-size:0.95rem; cursor:pointer;">
            <input type="checkbox" v-model="form.notificationPreferences.testDriveUpdates" style="accent-color:var(--primary);" />
            Test Drive Appointment Status Alerts
          </label>
        </div>

        <button type="submit" class="btn btn-primary btn-full" :disabled="saving">
          {{ saving ? 'Saving Profile...' : 'Save Changes' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { updateProfileApi } from '@/api/auth.api';
import { useToast } from '@/composables/useToast';

const authStore = useAuthStore();
const { showToast } = useToast();

const saving = ref(false);

const form = ref({
  name: authStore.user?.name || '',
  phone: authStore.user?.phone || '',
  notificationPreferences: {
    inApp: authStore.user?.notificationPreferences?.inApp ?? true,
    email: authStore.user?.notificationPreferences?.email ?? true,
    testDriveUpdates: authStore.user?.notificationPreferences?.testDriveUpdates ?? true
  }
});

const handleSave = async () => {
  saving.value = true;
  try {
    const res = await updateProfileApi(form.value);
    authStore.user = res.data;
    localStorage.setItem('autoluxe_user', JSON.stringify(res.data));
    showToast('Profile updated successfully!', 'success');
  } catch (err) {
    showToast(err.message || 'Error updating profile.', 'error');
  } finally {
    saving.value = false;
  }
};
</script>
