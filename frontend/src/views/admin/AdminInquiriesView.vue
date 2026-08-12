<template>
  <div>
    <div style="margin-bottom:2rem;">
      <h2 style="font-family:var(--font-heading); font-size:1.5rem; font-weight:700;">Customer Vehicle Inquiries</h2>
      <p style="color:var(--text-muted); font-size:0.9rem;">Review and respond to customer inquiries. Customers are notified via BullMQ background email workers.</p>
    </div>

    <div class="glass-panel" style="padding:1.5rem;">
      <div v-if="inquiries.length" style="display:flex; flex-direction:column; gap:1.5rem;">
        <div
          v-for="inq in inquiries"
          :key="inq._id"
          style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.5rem;"
        >
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem; flex-wrap:wrap; gap:0.75rem;">
            <div>
              <div style="font-weight:700; font-size:1.1rem;">{{ inq.name }}</div>
              <div style="font-size:0.88rem; color:var(--text-muted);">{{ inq.email }} · {{ inq.phone }}</div>
            </div>
            <div style="text-align:right;">
              <span class="badge" :class="inq.status === 'Responded' ? 'badge-confirmed' : 'badge-pending'">{{ inq.status }}</span>
              <div style="font-size:0.78rem; color:var(--text-dim); margin-top:0.25rem;">
                {{ new Date(inq.createdAt).toLocaleDateString() }}
              </div>
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1rem; padding:0.75rem; background:rgba(0,0,0,0.2); border-radius:4px;">
            <img v-if="inq.car?.images?.[0]" :src="inq.car.images[0]" style="width:56px; height:40px; object-fit:cover; border-radius:4px;" />
            <div>
              <div style="font-weight:700; font-size:0.9rem;">About: {{ inq.car?.title || 'Vehicle' }}</div>
              <div style="font-size:0.85rem; color:var(--text-muted);">{{ inq.message }}</div>
            </div>
          </div>

          <div v-if="inq.status !== 'Responded'" style="display:flex; gap:0.75rem;">
            <textarea
              v-model="responses[inq._id]"
              class="form-textarea"
              rows="2"
              placeholder="Type your response to the customer..."
              style="flex-grow:1;"
            ></textarea>
            <button
              @click="handleRespond(inq._id)"
              class="btn btn-primary btn-sm"
              style="align-self:flex-end; white-space:nowrap;"
            >
              Send Reply ✓
            </button>
          </div>

          <div v-else style="background:var(--primary-glow); border-left:3px solid var(--primary); padding:0.75rem 1rem; border-radius:4px;">
            <div style="font-size:0.8rem; color:var(--primary); font-weight:700; margin-bottom:0.25rem;">✓ REPLY SENT TO CUSTOMER:</div>
            <div style="font-size:0.9rem;">{{ inq.dealerResponse }}</div>
          </div>
        </div>
      </div>

      <div v-else style="text-align:center; padding:4rem; color:var(--text-muted);">
        No inquiries received yet.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAllInquiriesApi, updateInquiryStatusApi } from '@/api/inquiry.api';
import { useToast } from '@/composables/useToast';

const inquiries = ref([]);
const responses = ref({});
const { showToast } = useToast();

const fetchInquiries = async () => {
  try {
    const res = await getAllInquiriesApi();
    inquiries.value = res.data;
  } catch (err) {
    showToast('Failed to load inquiries.', 'error');
  }
};

const handleRespond = async (id) => {
  const reply = responses.value[id];
  if (!reply || !reply.trim()) {
    showToast('Please type a response first.', 'error');
    return;
  }
  try {
    await updateInquiryStatusApi(id, { status: 'Responded', dealerResponse: reply });
    showToast('Response sent to customer!', 'success');
    delete responses.value[id];
    fetchInquiries();
  } catch (err) {
    showToast('Error sending response.', 'error');
  }
};

onMounted(fetchInquiries);
</script>
