<template>
  <div class="cars-page">
    <div class="container">
      <div class="page-header">
        <div>
          <h1 class="page-title">Vehicle Showroom Inventory</h1>
          <p class="page-sub">Browse and filter our world-class vehicle fleet with real-time test drive scheduling.</p>
        </div>

        <!-- Mobile Filter Toggle -->
        <button class="filter-toggle-btn btn btn-secondary btn-sm" @click="filterDrawerOpen = !filterDrawerOpen">
          ⚙️ Filters {{ filterDrawerOpen ? '▲' : '▼' }}
        </button>
      </div>

      <!-- Filter + Grid Layout -->
      <div class="cars-layout">
        <!-- Sidebar Filters -->
        <aside class="filter-sidebar glass-panel" :class="{ 'drawer-open': filterDrawerOpen }">
          <div class="filter-header">
            <h3>Filters</h3>
            <button @click="carStore.resetFilters(); applyFilters();" class="reset-btn">Reset All</button>
          </div>

          <div class="form-group">
            <label class="form-label">Search Keyword</label>
            <input v-model="carStore.filters.search" @input="debouncedSearch" type="text" class="form-input" placeholder="Brand, model..." />
          </div>

          <div class="form-group">
            <label class="form-label">Brand</label>
            <select v-model="carStore.filters.brand" @change="applyFilters" class="form-select">
              <option value="">All Brands</option>
              <option value="Porsche">Porsche</option>
              <option value="BMW">BMW</option>
              <option value="Mercedes-Benz">Mercedes-Benz</option>
              <option value="Audi">Audi</option>
              <option value="Tesla">Tesla</option>
              <option value="Land Rover">Land Rover</option>
              <option value="Ferrari">Ferrari</option>
              <option value="Lexus">Lexus</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Category</label>
            <select v-model="carStore.filters.category" @change="applyFilters" class="form-select">
              <option value="">All Categories</option>
              <option v-for="cat in carStore.categories" :key="cat._id" :value="cat.slug">{{ cat.name }}</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Fuel Type</label>
            <select v-model="carStore.filters.fuelType" @change="applyFilters" class="form-select">
              <option value="">All Types</option>
              <option value="Electric">Electric</option>
              <option value="Petrol">Petrol</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Transmission</label>
            <select v-model="carStore.filters.transmission" @change="applyFilters" class="form-select">
              <option value="">All Transmissions</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Max Price ($)</label>
            <input v-model="carStore.filters.maxPrice" @change="applyFilters" type="number" class="form-input" placeholder="e.g. 200000" />
          </div>

          <div class="form-group">
            <label class="form-label">Sort By</label>
            <select v-model="carStore.filters.sort" @change="applyFilters" class="form-select">
              <option value="-createdAt">Newest Arrivals</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-year">Year: New to Old</option>
            </select>
          </div>

          <button @click="filterDrawerOpen = false" class="btn btn-primary btn-full mobile-apply-btn">
            Apply Filters
          </button>
        </aside>

        <!-- Vehicle Grid -->
        <div class="cars-results">
          <div v-if="carStore.loading" class="state-box">
            <div style="font-size:2.5rem; margin-bottom:1rem;">⟳</div>
            <p style="color:var(--text-muted);">Fetching matching inventory...</p>
          </div>

          <div v-else-if="carStore.cars.length === 0" class="glass-panel state-box">
            <div style="font-size:3rem; margin-bottom:1rem;">🏎️</div>
            <h3 style="font-family:var(--font-heading); font-size:1.4rem; font-weight:700; margin-bottom:0.5rem;">No Vehicles Found</h3>
            <p style="color:var(--text-muted); margin-bottom:1.5rem;">Try adjusting your search criteria or resetting filters.</p>
            <button @click="carStore.resetFilters(); applyFilters();" class="btn btn-primary">Reset Filters</button>
          </div>

          <div v-else>
            <div class="results-count" v-if="carStore.cars.length">
              <span class="badge badge-available">{{ carStore.cars.length }} vehicles found</span>
            </div>
            <div class="cars-grid">
              <CarCard v-for="car in carStore.cars" :key="car._id" :car="car" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCarStore } from '@/stores/car';
import CarCard from '@/components/common/CarCard.vue';

const carStore = useCarStore();
const route = useRoute();
const filterDrawerOpen = ref(false);

let timer = null;
const debouncedSearch = () => {
  clearTimeout(timer);
  timer = setTimeout(() => applyFilters(), 400);
};

const applyFilters = () => {
  carStore.fetchCars();
  filterDrawerOpen.value = false;
};

onMounted(() => {
  if (route.query.search) carStore.filters.search = route.query.search;
  if (route.query.fuelType) carStore.filters.fuelType = route.query.fuelType;
  if (route.query.category) carStore.filters.category = route.query.category;
  if (route.query.maxPrice) carStore.filters.maxPrice = route.query.maxPrice;
  carStore.fetchCars();
  carStore.fetchCategories();
});
</script>

<style scoped>
.cars-page {
  padding: 3rem 0;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-family: var(--font-heading);
  font-size: clamp(1.5rem, 4vw, 2.4rem);
  font-weight: 800;
  margin-bottom: 0.4rem;
}

.page-sub {
  color: var(--text-muted);
  font-size: 0.95rem;
}

/* Filter Toggle button — hidden on desktop */
.filter-toggle-btn {
  display: none;
}

/* Layout: Sidebar + Grid */
.cars-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  align-items: start;
}

.filter-sidebar {
  padding: 1.5rem;
  position: sticky;
  top: 90px;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filter-header h3 {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 700;
}

.reset-btn {
  background: none;
  color: var(--primary);
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
}

.results-count {
  margin-bottom: 1.25rem;
}

.state-box {
  text-align: center;
  padding: 4rem 2rem;
}

.mobile-apply-btn {
  display: none;
  margin-top: 0.75rem;
}

/* === TABLET: 768-1024px === */
@media (max-width: 1024px) {
  .cars-layout {
    grid-template-columns: 250px 1fr;
    gap: 1.5rem;
  }
}

/* === MOBILE: below 768px === */
@media (max-width: 768px) {
  .cars-page { padding: 1.5rem 0; }

  .filter-toggle-btn {
    display: inline-flex;
  }

  .mobile-apply-btn {
    display: block;
  }

  .cars-layout {
    grid-template-columns: 1fr;
    gap: 0;
  }

  /* Filter Sidebar — collapsible drawer on mobile */
  .filter-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 300;
    overflow-y: auto;
    border-radius: 0;
    transform: translateY(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .filter-sidebar.drawer-open {
    transform: translateY(0);
  }
}
</style>
