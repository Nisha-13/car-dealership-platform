import api from './axios';

export const createInquiryApi = (data) => api.post('/inquiries', data);
export const getMyInquiriesApi = () => api.get('/inquiries/my-inquiries');

// Admin
export const getAllInquiriesApi = (status) => api.get('/inquiries/admin/all', { params: { status } });
export const updateInquiryStatusApi = (id, data) => api.put(`/inquiries/admin/${id}/status`, data);
