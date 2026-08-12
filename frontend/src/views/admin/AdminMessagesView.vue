<template>
  <div>
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
      <div>
        <h2 style="font-family:var(--font-heading); font-size:1.5rem; font-weight:700;">Real-Time Customer Support Console</h2>
        <p style="color:var(--text-muted); font-size:0.9rem;">Live Socket.IO messaging with all registered customers. Messages are delivered instantly without page refresh.</p>
      </div>

      <!-- Quick Start Chat with Customer Dropdown -->
      <div style="display:flex; align-items:center; gap:0.75rem;">
        <select v-model="selectedCustomerForNewChat" @change="initiateNewChat" class="form-select" style="width:auto; font-size:0.88rem;" :disabled="chatStore.loading">
          <option value="" disabled>-- Select Customer to Message --</option>
          <option v-for="cust in customerList" :key="cust._id" :value="cust._id">
            👤 {{ cust.name }} ({{ cust.email }})
          </option>
        </select>
        
        <!-- Clear selection button -->
        <button v-if="selectedCustomerForNewChat" @click="selectedCustomerForNewChat = ''" class="btn btn-secondary btn-sm" title="Clear selection" style="padding:0.25rem 0.5rem;">
          ×
        </button>
        
        <div v-if="chatStore.loading" style="font-size:0.8rem; color:var(--text-muted);">
          Loading...
        </div>
      </div>
    </div>

    <div class="chat-container" :class="{ 'mobile-chat-active': !!chatStore.activePeer }">
      <!-- Customers Sidebar -->
      <div class="chat-peers-list">
        <div style="padding:1rem; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
          <div style="font-weight:700; font-size:0.85rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.08em;">Customer Channels</div>
          <span class="badge badge-pending" style="font-size:0.7rem;">{{ chatStore.conversations.length }}</span>
        </div>

        <div v-if="chatStore.conversations.length === 0" style="padding:2rem; text-align:center; color:var(--text-muted); font-size:0.88rem;">
          No active chat sessions yet. Select a customer from the dropdown above to start a message!
        </div>

        <div
          v-for="conv in chatStore.conversations"
          :key="conv.peer?._id || 'unknown'"
          class="chat-peer-item"
          :class="{ active: chatStore.activePeer?._id === conv.peer?._id }"
          @click="selectPeer(conv.peer)"
        >
          <div style="width:42px; height:42px; border-radius:50%; background:rgba(6,182,212,0.15); color:var(--accent-cyan); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:1.1rem; flex-shrink:0;">
            {{ conv.peer?.name?.charAt(0)?.toUpperCase() || '?' }}
          </div>
          <div style="flex-grow:1; min-width:0;">
            <div style="font-weight:700; font-size:0.95rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">{{ conv.peer?.name || 'Customer' }}</div>
            <div style="font-size:0.8rem; color:var(--text-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">{{ conv.lastMessage }}</div>
          </div>
          <div v-if="conv.unreadCount" class="notif-badge" style="position:static;">{{ conv.unreadCount }}</div>
        </div>
      </div>

      <!-- Chat Pane -->
      <div class="chat-messages-pane" v-if="chatStore.activePeer">
        <div class="chat-messages-header">
          <div style="display:flex; align-items:center; gap:0.85rem;">
            <button @click="chatStore.activePeer = null" class="btn btn-secondary btn-sm mobile-back-btn" style="padding:0.25rem 0.5rem;">
              ← Channels
            </button>
            <div style="width:10px; height:10px; border-radius:50%; background:#10b981; flex-shrink:0;"></div>
            <div>
              <div style="font-weight:700; font-size:0.95rem;">{{ chatStore.activePeer.name }}</div>
              <div style="font-size:0.78rem; color:var(--text-muted);">{{ chatStore.activePeer.email }} · Registered Client</div>
            </div>
            <!-- Show if this is the currently selected customer -->
            <div v-if="selectedCustomerForNewChat === chatStore.activePeer._id" style="font-size:0.7rem; background:rgba(6,182,212,0.15); color:var(--accent-cyan); padding:0.15rem 0.5rem; border-radius:12px; border:1px solid rgba(6,182,212,0.3);">
              Selected
            </div>
          </div>
        </div>

        <div class="chat-body" ref="chatBodyRef">
          <div
            v-for="msg in chatStore.messages"
            :key="msg._id"
            class="chat-bubble"
            :class="msg.sender._id === authStore.user.id ? 'sent' : 'received'"
          >
            <div>{{ msg.content }}</div>
            <div style="font-size:0.7rem; opacity:0.7; margin-top:0.25rem; text-align:right;">
              {{ new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
            </div>
          </div>

          <div v-if="chatStore.messages.length === 0" style="text-align:center; color:var(--text-muted); margin:auto; padding:2rem;">
            <div style="font-size:2rem; margin-bottom:1rem;">💬</div>
            <div style="font-weight:600; margin-bottom:0.5rem;">Start New Conversation</div>
            <div style="font-size:0.9rem;">No previous messages with {{ chatStore.activePeer.name }}.</div>
            <div style="font-size:0.85rem; margin-top:0.5rem;">Type your message below to begin chatting!</div>
          </div>
        </div>

        <form @submit.prevent="handleSend" class="chat-footer">
          <input
            v-model="messageText"
            type="text"
            class="form-input"
            placeholder="Type message to customer..."
            required
          />
          <button type="submit" class="btn btn-primary" :disabled="sending">
            {{ sending ? 'Sending...' : 'Send ✈️' }}
          </button>
        </form>
      </div>

      <div v-else class="chat-messages-pane" style="align-items:center; justify-content:center; padding:2rem; color:var(--text-muted); text-align:center; background:rgba(255,255,255,0.02);">
        <div style="font-size:3rem; margin-bottom:1rem;">💬</div>
        <div style="font-weight:600; font-size:1.1rem;">Select a Customer Channel</div>
        <div style="font-size:0.88rem; margin-top:0.25rem; margin-bottom:1rem;">Pick a customer from the left list or dropdown above</div>
        <div style="font-size:0.8rem; background:rgba(6,182,212,0.1); padding:0.75rem; border-radius:8px; border:1px solid rgba(6,182,212,0.2);">
          <div style="font-weight:600; color:var(--accent-cyan); margin-bottom:0.25rem;">Quick Tip:</div>
          <div>Use the dropdown menu above to start chatting with any registered customer!</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import { useChatStore } from '@/stores/chat';
import { useAuthStore } from '@/stores/auth';
import { useSocket } from '@/composables/useSocket';
import { getCustomersApi } from '@/api/stats.api';
import { useToast } from '@/composables/useToast';

const chatStore = useChatStore();
const authStore = useAuthStore();
const { sendMessage } = useSocket();
const { showToast } = useToast();

const messageText = ref('');
const sending = ref(false);
const chatBodyRef = ref(null);
const customerList = ref([]);
const selectedCustomerForNewChat = ref('');

const scrollToBottom = () => {
  nextTick(() => {
    setTimeout(() => {
      if (chatBodyRef.value) {
        chatBodyRef.value.scrollTop = chatBodyRef.value.scrollHeight;
      }
    }, 50);
  });
};

watch(() => chatStore.messages.length, () => {
  scrollToBottom();
});

watch(() => chatStore.activePeer, () => {
  scrollToBottom();
});

const selectPeer = async (peer) => {
  await chatStore.loadConversation(peer);
  scrollToBottom();
};

const initiateNewChat = async () => {
  const cust = customerList.value.find(c => c._id === selectedCustomerForNewChat.value);
  if (cust) {
    await chatStore.loadConversation(cust);
    // Show success message but DON'T clear the dropdown
    showToast(`Chat started with ${cust.name}`, 'success');
    
    scrollToBottom();
  }
};

const handleSend = async () => {
  if (!messageText.value.trim() || !chatStore.activePeer) return;
  sending.value = true;
  try {
    await sendMessage({
      recipientId: chatStore.activePeer._id || chatStore.activePeer.id,
      content: messageText.value
    });
    messageText.value = '';
    scrollToBottom();
  } catch (err) {
    showToast(err.message || 'Failed to send message.', 'error');
  } finally {
    sending.value = false;
  }
};

onMounted(async () => {
  await chatStore.fetchConversations();
  try {
    const custRes = await getCustomersApi();
    customerList.value = custRes.data;
  } catch (err) {}
});
</script>

<style scoped>
.mobile-back-btn {
  display: none;
}
@media (max-width: 1024px) {
  .mobile-back-btn {
    display: inline-flex;
  }
}
</style>
