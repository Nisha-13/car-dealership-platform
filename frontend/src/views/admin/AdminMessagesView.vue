<template>
  <div class="admin-chat-view">
    <div class="admin-chat-header">
      <div class="admin-chat-title-group">
        <h2 class="admin-chat-title">Real-Time Customer Support Console</h2>
        <p class="admin-chat-sub">Live Socket.IO messaging with registered customers. Messages are delivered instantly.</p>
      </div>

      <!-- Quick Start Chat with Customer Dropdown -->
      <div class="admin-chat-controls">
        <div class="select-wrapper">
          <select v-model="selectedCustomerForNewChat" @change="initiateNewChat" class="form-select customer-select" :disabled="chatStore.loading">
            <option value="" disabled>-- Select Customer to Message --</option>
            <option v-for="cust in customerList" :key="cust._id" :value="cust._id">
              👤 {{ cust.name }} ({{ cust.email }})
            </option>
          </select>
          <button v-if="selectedCustomerForNewChat" @click="selectedCustomerForNewChat = ''" class="btn btn-secondary btn-sm clear-select-btn" title="Clear selection">
            ×
          </button>
        </div>
        
        <div v-if="chatStore.loading" class="loading-indicator">
          Loading...
        </div>
      </div>
    </div>

    <div class="chat-container" :class="{ 'mobile-chat-active': !!chatStore.activePeer }">
      <!-- Customers Sidebar -->
      <div class="chat-peers-list">
        <div class="peers-list-header">
          <div class="peers-list-title">Customer Channels</div>
          <span class="badge badge-pending" style="font-size:0.7rem;">{{ chatStore.conversations.length }}</span>
        </div>

        <div v-if="chatStore.conversations.length === 0" class="empty-peers">
          No active chat sessions yet. Select a customer from the dropdown above to start a message!
        </div>

        <div
          v-for="conv in chatStore.conversations"
          :key="conv.peer?._id || 'unknown'"
          class="chat-peer-item"
          :class="{ active: chatStore.activePeer?._id === conv.peer?._id }"
          @click="selectPeer(conv.peer)"
        >
          <div class="peer-avatar">
            {{ conv.peer?.name?.charAt(0)?.toUpperCase() || '?' }}
          </div>
          <div class="peer-info">
            <div class="peer-name">{{ conv.peer?.name || 'Customer' }}</div>
            <div class="peer-last-msg">{{ conv.lastMessage }}</div>
          </div>
          <div v-if="conv.unreadCount" class="notif-badge" style="position:static; flex-shrink:0;">{{ conv.unreadCount }}</div>
        </div>
      </div>

      <!-- Chat Pane -->
      <div class="chat-messages-pane" v-if="chatStore.activePeer">
        <div class="chat-messages-header">
          <div class="active-peer-info">
            <button @click="chatStore.activePeer = null" class="btn btn-secondary btn-sm mobile-back-btn" title="Back to Channels">
              ← Channels
            </button>
            <div class="online-indicator"></div>
            <div class="peer-meta">
              <div class="peer-header-name">{{ chatStore.activePeer.name }}</div>
              <div class="peer-header-sub">{{ chatStore.activePeer.email }} · Registered Client</div>
            </div>
            <!-- Show if this is the currently selected customer -->
            <div v-if="selectedCustomerForNewChat === chatStore.activePeer._id" class="selected-badge">
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
            <div class="bubble-text">{{ msg.content }}</div>
            <div class="bubble-time">
              {{ new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
            </div>
          </div>

          <div v-if="chatStore.messages.length === 0" class="empty-conversation">
            <div style="font-size:2.5rem; margin-bottom:0.75rem;">💬</div>
            <div style="font-weight:700; font-size:1.05rem; margin-bottom:0.35rem;">Start New Conversation</div>
            <div style="font-size:0.88rem; color:var(--text-muted);">No previous messages with {{ chatStore.activePeer.name }}.</div>
            <div style="font-size:0.82rem; color:var(--primary); margin-top:0.35rem;">Type your message below to begin chatting!</div>
          </div>
        </div>

        <form @submit.prevent="handleSend" class="chat-footer">
          <input
            v-model="messageText"
            type="text"
            class="form-input chat-input"
            placeholder="Type message to customer..."
            required
          />
          <button type="submit" class="btn btn-primary send-btn" :disabled="sending || !messageText.trim()">
            {{ sending ? 'Sending...' : 'Send ✈️' }}
          </button>
        </form>
      </div>

      <div v-else class="chat-messages-pane empty-pane-placeholder">
        <div style="font-size:3rem; margin-bottom:1rem;">💬</div>
        <div style="font-weight:700; font-size:1.15rem; color:var(--text-main);">Select a Customer Channel</div>
        <div style="font-size:0.88rem; margin-top:0.35rem; margin-bottom:1.25rem;">Pick a customer from the left list or dropdown above</div>
        <div class="quick-tip-card">
          <div style="font-weight:700; color:var(--accent-cyan); margin-bottom:0.25rem;">Quick Tip:</div>
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
.admin-chat-view {
  width: 100%;
}

.admin-chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.admin-chat-title-group {
  flex: 1;
  min-width: 260px;
}

.admin-chat-title {
  font-family: var(--font-heading);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-main);
}

.admin-chat-sub {
  color: var(--text-muted);
  font-size: 0.88rem;
  margin-top: 0.25rem;
}

.admin-chat-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.select-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.customer-select {
  width: auto;
  min-width: 240px;
  font-size: 0.88rem;
}

.clear-select-btn {
  padding: 0.35rem 0.65rem;
  font-size: 0.95rem;
  line-height: 1;
}

.loading-indicator {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.peers-list-header {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.peers-list-title {
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.empty-peers {
  padding: 2rem 1.5rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.88rem;
  line-height: 1.5;
}

.peer-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(6, 182, 212, 0.15);
  color: var(--accent-cyan);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.peer-info {
  flex-grow: 1;
  min-width: 0;
}

.peer-name {
  font-weight: 700;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.peer-last-msg {
  font-size: 0.8rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}

.active-peer-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  flex-wrap: wrap;
}

.online-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #10b981;
  flex-shrink: 0;
}

.peer-meta {
  min-width: 0;
}

.peer-header-name {
  font-weight: 700;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.peer-header-sub {
  font-size: 0.78rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.selected-badge {
  font-size: 0.7rem;
  background: rgba(6, 182, 212, 0.15);
  color: var(--accent-cyan);
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
  border: 1px solid rgba(6, 182, 212, 0.3);
  font-weight: 600;
}

.empty-conversation {
  text-align: center;
  color: var(--text-muted);
  margin: auto;
  padding: 2rem 1rem;
}

.empty-pane-placeholder {
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  color: var(--text-muted);
  text-align: center;
  background: rgba(255, 255, 255, 0.02);
}

.quick-tip-card {
  font-size: 0.82rem;
  background: rgba(6, 182, 212, 0.1);
  padding: 0.85rem 1.25rem;
  border-radius: 8px;
  border: 1px solid rgba(6, 182, 212, 0.2);
  max-width: 400px;
}

.chat-input {
  flex: 1;
  min-width: 0;
}

.send-btn {
  flex-shrink: 0;
  padding: 0.72rem 1.2rem;
}

.mobile-back-btn {
  display: none;
}

@media (max-width: 1024px) {
  .mobile-back-btn {
    display: inline-flex;
    padding: 0.3rem 0.65rem;
    font-size: 0.82rem;
  }
}

@media (max-width: 768px) {
  .admin-chat-header {
    flex-direction: column;
    align-items: stretch;
  }

  .admin-chat-controls {
    width: 100%;
  }

  .select-wrapper {
    width: 100%;
  }

  .customer-select {
    width: 100%;
    min-width: 0;
    flex: 1;
  }

  .admin-chat-title {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .chat-footer {
    padding: 0.65rem 0.75rem;
  }

  .send-btn {
    padding: 0.65rem 0.9rem;
    font-size: 0.85rem;
  }
}
</style>
