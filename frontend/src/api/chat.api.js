import api from './axios';

export const getConversationsApi = () => api.get('/chat/conversations');
export const getConversationApi = (peerId) => api.get(`/chat/conversation/${peerId}`);
