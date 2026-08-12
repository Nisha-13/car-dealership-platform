import api from './axios';

export const bookTestDriveApi = (data) => api.post('/test-drives', data);
export const getMyTestDrivesApi = () => api.get('/test-drives/my-bookings');
export const cancelTestDriveApi = (id) => api.put(`/test-drives/${id}/cancel`);

// Admin
export const getAllTestDrivesApi = (params) => api.get('/test-drives/admin/all', { params });
export const updateTestDriveStatusApi = (id, data) => api.put(`/test-drives/admin/${id}/status`, data);
