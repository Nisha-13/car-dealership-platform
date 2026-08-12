<template>
  <div>
    <!-- Executive Stats Grid -->
    <div class="stats-grid">
      <StatCard title="Total Inventory Value" :value="`$${(stats.totalInventoryValue || 0).toLocaleString()}`" icon="💎" />
      <StatCard title="Available Fleet" :value="stats.availableCars || 0" icon="🏎️" />
      <StatCard title="Pending Test Drives" :value="stats.pendingTestDrives || 0" icon="📅" />
      <StatCard title="New Inquiries" :value="stats.newInquiries || 0" icon="💬" />
    </div>

    <div class="admin-dash-grid">
      <!-- Quick Inventory Summary -->
      <div class="glass-panel" style="padding:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:0.75rem;">
          <h3 style="font-family:var(--font-heading); font-size:1.2rem; font-weight:700;">Executive Performance Summary</h3>
          <router-link to="/admin/cars/create" class="btn btn-primary btn-sm">+ Add New Car</router-link>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:1rem; margin-bottom:1.5rem; text-align:center;">
          <div style="background:rgba(255,255,255,0.03); padding:1rem; border-radius:8px; border:1px solid var(--border-color);">
            <div style="font-size:0.8rem; color:var(--text-muted);">Total Inventory</div>
            <div style="font-size:1.5rem; font-weight:800; color:var(--text-main);">{{ stats.totalCars || 0 }}</div>
          </div>

          <div style="background:rgba(255,255,255,0.03); padding:1rem; border-radius:8px; border:1px solid var(--border-color);">
            <div style="font-size:0.8rem; color:var(--text-muted);">Sold Vehicles</div>
            <div style="font-size:1.5rem; font-weight:800; color:var(--status-confirmed);">{{ stats.soldCars || 0 }}</div>
          </div>

          <div style="background:rgba(255,255,255,0.03); padding:1rem; border-radius:8px; border:1px solid var(--border-color);">
            <div style="font-size:0.8rem; color:var(--text-muted);">Registered Clients</div>
            <div style="font-size:1.5rem; font-weight:800; color:var(--primary);">{{ stats.totalCustomers || 0 }}</div>
          </div>
        </div>

        <h4 style="font-family:var(--font-heading); font-size:1.1rem; font-weight:700; margin-bottom:1rem;">Quick Action Shortcuts</h4>
        <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
          <router-link to="/admin/test-drives" class="btn btn-secondary btn-sm">Manage Test Drives</router-link>
          <router-link to="/admin/inquiries" class="btn btn-secondary btn-sm">Review Inquiries</router-link>
          <router-link to="/admin/messages" class="btn btn-accent btn-sm">Launch Support Console</router-link>
        </div>
      </div>

      <!-- Live Activity Audit Feed -->
      <div class="glass-panel" style="padding:1.5rem;">
        <h3 style="font-family:var(--font-heading); font-size:1.2rem; font-weight:700; margin-bottom:1.25rem;">Live Activity Feed</h3>
        <div v-if="stats.recentActivity && stats.recentActivity.length" style="display:flex; flex-direction:column; gap:1rem;">
          <div
            v-for="act in stats.recentActivity"
            :key="act._id"
            style="border-left:3px solid var(--primary); padding-left:0.75rem; font-size:0.88rem;"
          >
            <div style="font-weight:700; color:var(--text-main);">{{ act.action }}</div>
            <div style="color:var(--text-muted); font-size:0.82rem;">{{ act.details }}</div>
            <div style="font-size:0.72rem; color:var(--text-dim); margin-top:0.25rem;">
              {{ new Date(act.createdAt).toLocaleTimeString() }}
            </div>
          </div>
        </div>
        <div v-else style="color:var(--text-muted); text-align:center; padding:2rem;">
          No recent activity logged.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import StatCard from '@/components/common/StatCard.vue';
import { getAdminStatsApi } from '@/api/stats.api';

const stats = ref({});

onMounted(async () => {
  try {
    const res = await getAdminStatsApi();
    stats.value = res.data;
  } catch (err) {
    console.error('Admin stats error:', err);
  }
});
</script>

<style scoped>
.admin-dash-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
}
@media (max-width: 1024px) {
  .admin-dash-grid {
    grid-template-columns: 1fr;
  }
}
</style>
