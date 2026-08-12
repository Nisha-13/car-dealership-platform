import { defineStore } from 'pinia';
import { getConversationsApi, getConversationApi } from '@/api/chat.api';

export const useChatStore = defineStore('chat', {
  state: () => ({
    conversations: [],
    activePeer: null,
    messages: [],
    loading: false
  }),

  actions: {
    async fetchConversations() {
      try {
        const res = await getConversationsApi();
        this.conversations = res.data;
        return res.data;
      } catch (err) {
        console.error('Fetch conversations error:', err);
      }
    },

    async loadConversation(peer) {
      this.activePeer = peer;
      this.loading = true;
      try {
        // Try to load existing conversation
        const res = await getConversationApi(peer._id || peer.id);
        this.messages = res.data;
        
        // If no messages exist yet, initialize empty messages array
        // This allows admin to start new conversation
        if (!res.data || res.data.length === 0) {
          this.messages = [];
        }
        
        // Refresh conversations unread status
        await this.fetchConversations();
      } catch (err) {
        // If error (e.g., no conversation exists), initialize empty messages
        console.error('Load conversation error:', err);
        this.messages = [];
        
        // Still refresh conversations list
        await this.fetchConversations();
      } finally {
        this.loading = false;
      }
    },

    appendMessage(msg) {
      // Check if message belongs to active peer conversation
      if (
        this.activePeer &&
        (msg.sender._id === this.activePeer._id || msg.recipient._id === this.activePeer._id)
      ) {
        this.messages.push(msg);
      }
      this.fetchConversations();
    }
  }
});
