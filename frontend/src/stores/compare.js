import { defineStore } from 'pinia';

export const useCompareStore = defineStore('compare', {
  state: () => ({
    compareList: JSON.parse(localStorage.getItem('autoluxe_compare')) || []
  }),

  actions: {
    addCar(car) {
      if (this.compareList.length >= 4) {
        throw new Error('You can compare a maximum of 4 vehicles at a time.');
      }
      if (!this.compareList.some(c => c._id === car._id)) {
        this.compareList.push(car);
        localStorage.setItem('autoluxe_compare', JSON.stringify(this.compareList));
      }
    },

    removeCar(carId) {
      this.compareList = this.compareList.filter(c => c._id !== carId);
      localStorage.setItem('autoluxe_compare', JSON.stringify(this.compareList));
    },

    clearAll() {
      this.compareList = [];
      localStorage.removeItem('autoluxe_compare');
    },

    isInCompare(carId) {
      return this.compareList.some(c => c._id === carId);
    }
  }
});
