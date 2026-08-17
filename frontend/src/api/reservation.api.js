import api from './axios';

// ── CUSTOMER ENDPOINTS ────────────────────────────────────────────────────────
export const createReservationApi = (data) => api.post('/reservations', data);
export const getMyReservationsApi = () => api.get('/reservations/my-reservations');
export const getReservationByIdApi = (id) => api.get(`/reservations/${id}`);
export const cancelReservationApi = (id, data = {}) => api.put(`/reservations/${id}/cancel`, data);

// ── ADMIN ENDPOINTS ───────────────────────────────────────────────────────────
export const getAllReservationsApi = (params) => api.get('/reservations/admin/all', { params });
export const updateReservationStatusApi = (id, data) => api.put(`/reservations/admin/${id}/status`, data);
export const releaseCarApi = (id) => api.put(`/reservations/admin/${id}/release-car`);
