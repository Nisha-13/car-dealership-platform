import api from './axios';

export const getCarsApi = (params) => api.get('/cars', { params });
export const getCarByIdApi = (id) => api.get(`/cars/${id}`);
export const getCategoriesApi = () => api.get('/categories');
export const toggleFavoriteApi = (id) => api.post(`/cars/${id}/favorite`);
export const getFavoritesApi = () => api.get('/cars/favorites');

// Admin API
export const createCarApi = (formData) => api.post('/cars', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateCarApi = (id, formData) => api.put(`/cars/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteCarApi = (id) => api.delete(`/cars/${id}`);
export const createCategoryApi = (data) => api.post('/categories', data);
export const deleteCategoryApi = (id) => api.delete(`/categories/${id}`);
