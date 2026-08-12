<template>
  <div>
    <div style="margin-bottom:1.5rem;">
      <h2 style="font-family:var(--font-heading); font-size:1.5rem; font-weight:700;">Live Dealer Concierge Chat</h2>
      <p style="color:var(--text-muted); font-size:0.9rem;">Real-time Socket.IO communication with AutoLuxe dealership directors.</p>
    </div>

    <div class="chat-container" :class="{ 'mobile-chat-active': !!chatStore.activePeer }">
      <!-- Peer Sidebar -->
      <div class="chat-peers-list">
        <div
          v-for="conv in chatStore.conversations"
          :key="conv.peer?._id || 'admin'"
          class="chat-peer-item"
          :class="{ active: chatStore.activePeer?._id === conv.peer?._id }"
          @click="selectPeer(conv.peer)"
        >
          <div style="width:42px; height:42px; border-radius:50%; background:var(--primary-glow); color:var(--primary); display:flex; align-items:center; justify-content:center; font-weight:800; flex-shrink:0;">
            👑
          </div>
          <div style="flex-grow:1; min-width:0;">
            <div style="font-weight:700; font-size:0.95rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              {{ conv.peer?.name || 'AutoLuxe Dealer Concierge' }}
            </div>
            <div style="font-size:0.8rem; color:var(--text-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              {{ conv.lastMessage }}
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Pane -->
      <div class="chat-messages-pane" v-if="chatStore.activePeer">
        <div class="chat-messages-header">
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <button @click="chatStore.activePeer = null" class="btn btn-secondary btn-sm mobile-back-btn" style="padding:0.25rem 0.5rem;">
              ← Back
            </button>
            <div style="width:10px; height:10px; border-radius:50%; background:#10b981; flex-shrink:0;"></div>
            <div>
              <div style="font-weight:700; font-size:0.95rem;">{{ chatStore.activePeer.name }}</div>
              <div style="font-size:0.78rem; color:var(--text-muted);">Dealer Representative Online</div>
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
        </div>

        <form @submit.prevent="handleSend" class="chat-footer">
          <input
            v-model="messageText"
            type="text"
            class="form-input"
            placeholder="Type your message to dealer..."
            required
          />
          <button type="submit" class="btn btn-primary" :disabled="sending">
            Send ✈️
          </button>
        </form>
      </div>

      <div v-else class="chat-messages-pane" style="align-items:center; justify-content:center; padding:2rem; color:var(--text-muted); text-align:center;">
        <div style="font-size:3rem; margin-bottom:1rem;">💬</div>
        <div style="font-weight:600; font-size:1.1rem;">Select a Conversation</div>
        <div style="font-size:0.88rem; margin-top:0.25rem;">Live dealer concierge channel ready</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import { useChatStore } from '@/stores/chat';
import { useAuthStore } from '@/stores/auth';
import { useSocket } from '@/composables/useSocket';
import { useToast } from '@/composables/useToast';

const chatStore = useChatStore();
const authStore = useAuthStore();
const { sendMessage } = useSocket();
const { showToast } = useToast();

const messageText = ref('');
const sending = ref(false);
const chatBodyRef = ref(null);

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
  const convs = await chatStore.fetchConversations();
  if (convs && convs.length > 0) {
    await chatStore.loadConversation(convs[0].peer);
    scrollToBottom();
  }
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
