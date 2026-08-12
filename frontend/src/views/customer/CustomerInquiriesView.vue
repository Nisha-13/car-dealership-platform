<template>
  <div>
    <div style="margin-bottom:2rem;">
      <h2 style="font-family:var(--font-heading); font-size:1.5rem; font-weight:700;">My Inquiries & Dealer Responses</h2>
      <p style="color:var(--text-muted); font-size:0.9rem;">Review responses and status for your vehicle inquiries.</p>
    </div>

    <div class="glass-panel" style="padding:1.5rem;">
      <div v-if="inquiries.length" style="display:flex; flex-direction:column; gap:1.25rem;">
        <div
          v-for="inq in inquiries"
          :key="inq._id"
          style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;"
        >
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
            <div>
              <span style="font-weight:700; font-size:1.05rem;">{{ inq.car?.title || 'General Inquiry' }}</span>
              <span style="font-size:0.8rem; color:var(--text-muted); margin-left:0.75rem;">{{ new Date(inq.createdAt).toLocaleDateString() }}</span>
            </div>
            <span class="badge" :class="inq.status === 'Responded' ? 'badge-confirmed' : 'badge-pending'">{{ inq.status }}</span>
          </div>

          <div style="color:var(--text-main); font-size:0.95rem; margin-bottom:1rem; padding:0.75rem; background:rgba(0,0,0,0.2); border-radius:4px;">
            "{{ inq.message }}"
          </div>

          <div v-if="inq.dealerResponse" style="background:var(--primary-glow); border-left:3px solid var(--primary); padding:0.85rem 1rem; border-radius:4px;">
            <div style="font-weight:700; font-size:0.85rem; color:var(--primary); margin-bottom:0.25rem;">👑 AutoLuxe Dealer Representative Reply:</div>
            <div style="font-size:0.9rem; color:var(--text-main);">{{ inq.dealerResponse }}</div>
          </div>
          <div v-else style="font-size:0.85rem; color:var(--text-muted); italic;">
            Our dealer team is reviewing your inquiry...
          </div>
        </div>
      </div>

      <div v-else style="text-align:center; padding:4rem; color:var(--text-muted);">
        No vehicle inquiries submitted yet.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getMyInquiriesApi } from '@/api/inquiry.api';

const inquiries = ref([]);

onMounted(async () => {
  try {
    const res = await getMyInquiriesApi();
    inquiries.value = res.data;
  } catch (err) {
    console.error('Fetch inquiries error:', err);
  }
});
</script>
