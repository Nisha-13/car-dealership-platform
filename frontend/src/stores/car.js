import { defineStore } from 'pinia';
import { getCarsApi, getCarByIdApi, getCategoriesApi, toggleFavoriteApi, getFavoritesApi } from '@/api/car.api';

export const useCarStore = defineStore('car', {
  state: () => ({
    cars: [],
    categories: [],
    favorites: [],
    currentCar: null,
    pagination: { total: 0, page: 1, pages: 1 },
    filters: {
      search: '',
      brand: '',
      category: '',
      fuelType: '',
      transmission: '',
      minPrice: '',
      maxPrice: '',
      sort: '-createdAt'
    },
    loading: false
  }),

  actions: {
    async fetchCars(customParams = {}) {
      this.loading = true;
      try {
        const queryParams = { ...this.filters, ...customParams };
        const res = await getCarsApi(queryParams);
        this.cars = res.data.cars;
        this.pagination = res.data.pagination;
      } catch (err) {
        console.error('Fetch cars error:', err);
      } finally {
        this.loading = false;
      }
    },

    async fetchCarById(id) {
      this.loading = true;
      try {
        const res = await getCarByIdApi(id);
        this.currentCar = res.data;
        return res.data;
      } catch (err) {
        console.error('Fetch car detail error:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchCategories() {
      try {
        const res = await getCategoriesApi();
        this.categories = res.data;
      } catch (err) {
        console.error('Fetch categories error:', err);
      }
    },

    async fetchFavorites() {
      try {
        const res = await getFavoritesApi();
        this.favorites = res.data;
      } catch (err) {
        console.error('Fetch favorites error:', err);
      }
    },

    async toggleFavorite(carId) {
      try {
        const res = await toggleFavoriteApi(carId);
        await this.fetchFavorites();
        return res.data;
      } catch (err) {
        throw err;
      }
    },

    isFavorite(carId) {
      return this.favorites.some(c => c && (c._id === carId || c.id === carId));
    },

    resetFilters() {
      this.filters = {
        search: '',
        brand: '',
        category: '',
        fuelType: '',
        transmission: '',
        minPrice: '',
        maxPrice: '',
        sort: '-createdAt'
      };
      this.fetchCars();
    }
  }
});
