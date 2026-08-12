<template>
  <div>
    <div style="margin-bottom:2rem;">
      <h2 style="font-family:var(--font-heading); font-size:1.5rem; font-weight:700;">System Audit & Activity Logs</h2>
      <p style="color:var(--text-muted); font-size:0.9rem;">Full audit trail of all user actions, test drive events, and system operations tracked by the EventEmitter listener system.</p>
    </div>

    <div class="glass-panel" style="padding:1.5rem;">
      <div class="table-responsive" v-if="logs.length">
        <table class="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action / Event</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in logs" :key="log._id">
              <td style="font-size:0.85rem; color:var(--text-muted); white-space:nowrap;">
                {{ new Date(log.createdAt).toLocaleString() }}
              </td>
              <td>
                <div v-if="log.user">
                  <div style="font-weight:700; font-size:0.9rem;">{{ log.user.name }}</div>
                  <div style="font-size:0.78rem; color:var(--text-muted);">{{ log.user.email }}</div>
                </div>
                <span v-else style="color:var(--text-dim); font-size:0.85rem;">System</span>
              </td>
              <td>
                <span style="font-weight:700; color:var(--primary);">{{ log.action }}</span>
              </td>
              <td style="font-size:0.88rem; color:var(--text-muted);">{{ log.details || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else style="text-align:center; padding:4rem; color:var(--text-muted);">
        No activity logs recorded yet.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getActivityLogsApi } from '@/api/stats.api';
import { useToast } from '@/composables/useToast';

const logs = ref([]);
const { showToast } = useToast();

onMounted(async () => {
  try {
    const res = await getActivityLogsApi();
    logs.value = res.data;
  } catch (err) {
    showToast('Failed to load activity logs.', 'error');
  }
});
</script>
