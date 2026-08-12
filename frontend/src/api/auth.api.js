import api from './axios';

export const loginApi = (credentials) => api.post('/auth/login', credentials);
export const registerApi = (userData) => api.post('/auth/register', userData);
export const getProfileApi = () => api.get('/auth/me');
export const updateProfileApi = (data) => api.put('/auth/profile', data);
