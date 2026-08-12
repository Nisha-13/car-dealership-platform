import api from './axios';

export const getAdminStatsApi = () => api.get('/stats/admin');
export const getCustomerStatsApi = () => api.get('/stats/customer');
export const getCustomersApi = () => api.get('/users/customers');
export const getActivityLogsApi = () => api.get('/users/activity-logs');
