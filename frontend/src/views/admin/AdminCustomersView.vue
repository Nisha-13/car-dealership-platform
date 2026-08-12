<template>
  <div>
    <div style="margin-bottom:2rem;">
      <h2 style="font-family:var(--font-heading); font-size:1.5rem; font-weight:700;">Registered Customers</h2>
      <p style="color:var(--text-muted); font-size:0.9rem;">View and manage all registered customer accounts on the AutoLuxe platform.</p>
    </div>

    <div class="glass-panel" style="padding:1.5rem;">
      <div class="table-responsive" v-if="customers.length">
        <table class="data-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cust in customers" :key="cust._id">
              <td>
                <div style="display:flex; align-items:center; gap:0.75rem;">
                  <div style="width:38px; height:38px; border-radius:50%; background:var(--primary-glow); color:var(--primary); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.95rem;">
                    {{ cust.name?.charAt(0)?.toUpperCase() }}
                  </div>
                  <div>
                    <div style="font-weight:700;">{{ cust.name }}</div>
                    <span class="badge badge-available" style="font-size:0.7rem;">Customer</span>
                  </div>
                </div>
              </td>
              <td>{{ cust.email }}</td>
              <td>{{ cust.phone || '—' }}</td>
              <td style="color:var(--text-muted); font-size:0.88rem;">{{ new Date(cust.createdAt).toLocaleDateString() }}</td>
              <td>
                <button
                  @click="startChat(cust)"
                  class="btn btn-accent btn-sm"
                >
                  💬 Message
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else style="text-align:center; padding:4rem; color:var(--text-muted);">
        No registered customers yet.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getCustomersApi } from '@/api/stats.api';
import { useChatStore } from '@/stores/chat';
import { useToast } from '@/composables/useToast';

const customers = ref([]);
const chatStore = useChatStore();
const router = useRouter();
const { showToast } = useToast();

const startChat = async (customer) => {
  await chatStore.loadConversation(customer);
  router.push('/admin/messages');
};

onMounted(async () => {
  try {
    const res = await getCustomersApi();
    customers.value = res.data;
  } catch (err) {
    showToast('Failed to load customers.', 'error');
  }
});
</script>
