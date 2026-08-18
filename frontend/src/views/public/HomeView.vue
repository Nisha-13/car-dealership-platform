<template>
  <div class="home-page">
    <!-- Simple & Professional Hero Section -->
    <section class="hero-section">
      <!-- Clean Car Slider -->
      <div class="car-slider">
        <div class="slider-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
          <div 
            v-for="(car, index) in sliderCars" 
            :key="car._id || index" 
            class="slider-slide"
            @mouseenter="pauseSlider"
            @mouseleave="resumeSlider"
          >
            <div class="slide-bg" :style="{ 
              backgroundImage: `url(${car.images && car.images.length > 0 ? car.images[0] : car.placeholderImage})`
            }"></div>
            
            <div class="slide-overlay"></div>
            
            <div class="slide-info">
              <div class="car-badge">{{ car.brand || 'Premium' }}</div>
              <h1 class="car-title">{{ car.year || '2026' }} {{ car.brand || 'Luxury' }} {{ car.model || 'Vehicle' }}</h1>
              <div class="car-price">${{ formatPrice(car.price) || '150,000' }}</div>
              <div class="car-details">
                <span class="detail-item">🏎️ {{ (car.specifications && car.specifications.horsepower) || '500 HP' }}</span>
                <span class="detail-item">⚡ {{ car.fuelType || 'Hybrid' }}</span>
                <span class="detail-item">📏 {{ car.engine || '4.0L V8' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Simple Slider Controls -->
        <div class="slider-nav">
          <button class="nav-btn prev" @click="prevSlide" aria-label="Previous">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
            </svg>
          </button>
          
          <div class="slider-dots">
            <button 
              v-for="(_, index) in sliderCars" 
              :key="index" 
              class="dot" 
              :class="{ 'active': index === currentSlide }"
              @click="goToSlide(index)"
              :aria-label="`Slide ${index + 1}`"
            ></button>
          </div>
          
          <button class="nav-btn next" @click="nextSlide" aria-label="Next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Search Section -->
      <div class="search-section">
        <div class="container">
          <h2 class="search-title">Find Your Luxury Vehicle</h2>
          <p class="search-subtitle">Browse our exclusive premium collection</p>
          
          <div class="search-box">
            <div class="search-filters">
              <div class="filter-group">
                <input v-model="searchQuery" type="text" class="search-input" placeholder="Search model (e.g. Taycan, M5)" />
              </div>
              
              <div class="filter-group">
                <select v-model="fuelType" class="filter-select">
                  <option value="">Fuel Type</option>
                  <option value="Electric">Electric</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              
              <div class="filter-group">
                <select v-model="maxPrice" class="filter-select">
                  <option value="">Max Price</option>
                  <option
                    v-for="opt in priceOptions"
                    :key="opt"
                    :value="opt"
                  >{{ formatPriceLabel(opt) }}</option>
                </select>
              </div>
              
              <button @click="handleSearch" class="search-btn">
                🔍 Search
              </button>
            </div>
            
            <div class="stats-row">
              <div class="stat-item">
                <div class="stat-number" :class="{ 'loading': !carStore.cars.length }">
                  {{ totalCars }}
                </div>
                <div class="stat-label">Luxury Models</div>
              </div>
              
              <div class="stat-divider"></div>
              
              <div class="stat-item">
                <div class="stat-number" :class="{ 'loading': !carStore.cars.length }">
                  {{ verifiedPercentage }}<span v-if="carStore.cars.length">%</span>
                </div>
                <div class="stat-label">Verified</div>
              </div>
              
              <div class="stat-divider"></div>
              
              <div class="stat-item">
                <div class="stat-number">24/7</div>
                <div class="stat-label">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>


    <!-- Featured Vehicles Showcase -->
    <section class="section-padded">
      <div class="container">
        <div class="section-header">
          <div>
            <span class="section-label">Showroom Highlights</span>
            <h2 class="section-title">Featured Luxury Inventory</h2>
          </div>
          <router-link to="/cars" class="btn btn-secondary">
            View All Vehicles →
          </router-link>
        </div>

        <div class="cars-grid" v-if="featuredCars.length">
          <CarCard v-for="car in featuredCars" :key="car._id" :car="car" />
        </div>

        <div v-else-if="carStore.loading" class="loading-state">
          <div class="loading-spinner">⟳</div>
          <p>Loading premium vehicles...</p>
        </div>
      </div>
    </section>

    <!-- Why AutoLuxe Strip -->
    <section class="why-strip">
      <div class="container">
        <div class="why-grid">
          <div class="why-item">
            <div class="why-icon">🔴</div>
            <div class="why-text">
              <strong>Live Test Drives</strong>
              <span>Book & get confirmed in real-time</span>
            </div>
          </div>
          <div class="why-item">
            <div class="why-icon">💬</div>
            <div class="why-text">
              <strong>Live Dealer Chat</strong>
              <span>Socket.IO powered instant messaging</span>
            </div>
          </div>
          <div class="why-item">
            <div class="why-icon">🔒</div>
            <div class="why-text">
              <strong>Secure & Verified</strong>
              <span>JWT Auth + RBAC security</span>
            </div>
          </div>
          <div class="why-item">
            <div class="why-icon">📊</div>
            <div class="why-text">
              <strong>Compare Vehicles</strong>
              <span>Side-by-side spec comparison</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Banner -->
    <section class="section-padded">
      <div class="container">
        <div class="section-header-center">
          <span class="section-label" style="color:var(--accent-cyan);">Explore Categories</span>
          <h2 class="section-title">Tailored to Your Driving Passion</h2>
          <p class="section-sub">Find the perfect vehicle from our meticulously curated performance categories.</p>
        </div>

        <div class="categories-grid" v-if="carStore.categories.length">
          <div
            v-for="cat in carStore.categories"
            :key="cat._id"
            class="category-card glass-panel"
            @click="router.push({ name: 'cars', query: { category: cat.slug } })"
          >
            <div class="cat-icon">🏎️</div>
            <h3 class="cat-name">{{ cat.name }}</h3>
            <p class="cat-desc">{{ cat.description }}</p>
            <span class="cat-cta">Explore {{ cat.name }} →</span>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Banner -->
    <section class="cta-banner">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">Ready to Experience AutoLuxe?</h2>
          <p class="cta-sub">Create your account and get instant access to exclusive test drives, live dealer chat, and personalized vehicle recommendations.</p>
          <div class="cta-actions">
            <router-link to="/register" class="btn btn-primary btn-lg">Create Free Account</router-link>
            <router-link to="/cars" class="btn btn-secondary btn-lg">Browse Inventory</router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useCarStore } from '@/stores/car';
import CarCard from '@/components/common/CarCard.vue';

const carStore = useCarStore();
const router = useRouter();

const searchQuery = ref('');
const fuelType = ref('');
const maxPrice = ref('');
const currentSlide = ref(0);
const sliderInterval = ref(null);

// Generates 4-5 smart price bracket options from real DB min/max
const priceOptions = computed(() => {
  const { maxPrice: dbMax } = carStore.priceRange;
  if (!dbMax || dbMax <= 0) return [];

  // Round up to nearest nice number then split into ~4 buckets
  const ceilTo = (val, step) => Math.ceil(val / step) * step;
  const step = dbMax <= 100000 ? 25000
    : dbMax <= 300000 ? 50000
    : dbMax <= 600000 ? 100000
    : 200000;

  const top = ceilTo(dbMax, step);
  const opts = [];
  for (let v = step; v <= top; v += step) {
    opts.push(v);
  }
  // Always include the real max if not already present
  if (opts[opts.length - 1] < dbMax) opts.push(ceilTo(dbMax, step));
  return opts;
});

const formatPriceLabel = (val) => {
  if (val >= 1000000) return `Under $${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000)    return `Under $${(val / 1000).toFixed(0)}K`;
  return `Under $${val}`;
};

const featuredCars = computed(() => {
  return carStore.cars.filter(c => c.featured || c.status === 'Available').slice(0, 6);
});

const sliderCars = computed(() => {
  const cars = carStore.cars.filter(c => c.featured || c.status === 'Available').slice(0, 4);
  
  // Add placeholderImage to real cars if they don't have images
  const processedCars = cars.map(car => ({
    ...car,
    placeholderImage: car.images && car.images.length > 0 ? car.images[0] : getPlaceholderImage(car.brand)
  }));
  
  // Always show at least 4 slides with professional images
  if (processedCars.length > 0) {
    return processedCars;
  }
  
  return [
    { 
      _id: 'slide1', 
      brand: 'Porsche', 
      model: '911 Turbo S', 
      price: 210000, 
      year: 2024, 
      fuelType: 'Petrol', 
      engine: '3.8L Flat-6', 
      images: [], 
      specifications: { horsepower: '640 HP' },
      placeholderImage: 'https://images.unsplash.com/photo-1593941707882-a5bba5338fe2?auto=format&fit=crop&w=2000&q=80'
    },
    { 
      _id: 'slide2', 
      brand: 'Tesla', 
      model: 'Model S Plaid', 
      price: 135000, 
      year: 2024, 
      fuelType: 'Electric', 
      engine: 'Tri Motor', 
      images: [], 
      specifications: { horsepower: '1020 HP' },
      placeholderImage: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=2000&q=80'
    },
    { 
      _id: 'slide3', 
      brand: 'Mercedes', 
      model: 'AMG GT 63 S', 
      price: 185000, 
      year: 2024, 
      fuelType: 'Petrol', 
      engine: '4.0L V8', 
      images: [], 
      specifications: { horsepower: '630 HP' },
      placeholderImage: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=2000&q=80'
    },
    { 
      _id: 'slide4', 
      brand: 'BMW', 
      model: 'M8 Competition', 
      price: 165000, 
      year: 2024, 
      fuelType: 'Petrol', 
      engine: '4.4L V8', 
      images: [], 
      specifications: { horsepower: '617 HP' },
      placeholderImage: 'https://images.unsplash.com/photo-1555212697-194d092e3b8f?auto=format&fit=crop&w=2000&q=80'
    }
  ];
});

// Helper function to get appropriate placeholder image based on brand
const getPlaceholderImage = (brand) => {
  const brandImages = {
    'Porsche': 'https://images.unsplash.com/photo-1593941707882-a5bba5338fe2?auto=format&fit=crop&w=2000&q=80',
    'Tesla': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=2000&q=80',
    'Mercedes': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=2000&q=80',
    'BMW': 'https://images.unsplash.com/photo-1555212697-194d092e3b8f?auto=format&fit=crop&w=2000&q=80',
    'Audi': 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=2000&q=80',
    'Ferrari': 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=2000&q=80',
    'Lamborghini': 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=2000&q=80'
  };
  
  return brandImages[brand] || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=2000&q=80';
};

const totalCars = computed(() => {
  if (!carStore.cars.length) return '50+';
  return carStore.cars.length > 50 ? '50+' : `${carStore.cars.length}+`;
});

const verifiedPercentage = computed(() => {
  if (!carStore.cars.length) return 100;
  const availableCars = carStore.cars.filter(car => car.status === 'Available');
  return Math.round((availableCars.length / carStore.cars.length) * 100);
});

// Slider Methods
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % sliderCars.value.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + sliderCars.value.length) % sliderCars.value.length;
};

const goToSlide = (index) => {
  currentSlide.value = index;
};

const formatPrice = (price) => {
  if (!price) return '150,000';
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const startSlider = () => {
  if (sliderInterval.value) clearInterval(sliderInterval.value);
  sliderInterval.value = setInterval(() => {
    nextSlide();
  }, 5000); // Change slide every 5 seconds
};

const stopSlider = () => {
  if (sliderInterval.value) {
    clearInterval(sliderInterval.value);
    sliderInterval.value = null;
  }
};

const pauseSlider = () => {
  stopSlider();
};

const resumeSlider = () => {
  if (!sliderInterval.value) {
    startSlider();
  }
};

const handleSearch = () => {
  router.push({
    name: 'cars',
    query: {
      search: searchQuery.value,
      fuelType: fuelType.value,
      maxPrice: maxPrice.value
    }
  });
};

const handleInquire = (car) => {
  // Navigate to contact page or show inquiry modal
  router.push({
    name: 'contact',
    query: { 
      car: car.model || 'Vehicle',
      brand: car.brand || 'Premium'
    }
  });
};

const handleViewCar = (car) => {
  if (car._id && !car._id.startsWith('slide')) {
    // Real car - navigate to car detail
    router.push({ name: 'car-detail', params: { id: car._id } });
  } else {
    // Placeholder car - navigate to cars page
    router.push({ name: 'cars' });
  }
};

onMounted(async () => {
  await carStore.fetchCars({ limit: 12 }); // Fetch more cars for slider
  await carStore.fetchCategories();
  await carStore.fetchPriceRange(); // Load real DB price range

  
  // Debug: Check what cars we have
  console.log('Slider cars:', sliderCars.value);
  console.log('Car store cars:', carStore.cars);
  console.log('First car details:', carStore.cars[0]);
  
  startSlider();
});

onBeforeUnmount(() => {
  stopSlider();
});
</script>

<style scoped>
/* ===========================================
   CLEAN & PROFESSIONAL HERO SECTION
   =========================================== */

.hero-section {
  position: relative;
  min-height: 100vh;
  background: var(--bg-surface);
}

/* Clean Car Slider */
.car-slider {
  position: relative;
  height: 60vh;
  overflow: hidden;
  background: #000;
}

.slider-track {
  display: flex;
  height: 100%;
  transition: transform 0.6s ease;
}

.slider-slide {
  position: relative;
  min-width: 100%;
  height: 100%;
}

.slide-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.8;
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3));
}

.slide-info {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 5%;
  max-width: 1200px;
  margin: 0 auto;
  color: #fff;
}

.car-badge {
  display: inline-block;
  background: var(--primary);
  color: #000;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  margin-bottom: 1rem;
  align-self: flex-start;
}

.car-title {
  font-family: var(--font-heading);
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 0.5rem;
  max-width: 800px;
}

.car-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 1.5rem;
}

.car-details {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.detail-item {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  backdrop-filter: blur(5px);
}

/* Simple Slider Controls */
.slider-nav {
  position: absolute;
  bottom: 2rem;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  z-index: 10;
}

.nav-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.slider-dots {
  display: flex;
  gap: 0.5rem;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}

.dot:hover {
  background: rgba(255, 255, 255, 0.5);
}

.dot.active {
  background: var(--primary);
  width: 24px;
  border-radius: 4px;
}

/* Search Section */
.search-section {
  padding: 3rem 1.5rem;
  background: var(--bg-surface);
}

.search-section .container {
  max-width: 1200px;
  margin: 0 auto;
}

.search-title {
  font-family: var(--font-heading);
  font-size: clamp(1.8rem, 3vw, 2.2rem);
  font-weight: 800;
  text-align: center;
  margin-bottom: 0.5rem;
  color: var(--text-main);
}

.search-subtitle {
  text-align: center;
  color: var(--text-muted);
  margin-bottom: 2rem;
  font-size: 1rem;
}

.search-box {
  max-width: 800px;
  margin: 0 auto;
}

.search-filters {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 1rem;
  margin-bottom: 2rem;
}

.filter-group {
  margin-bottom: 0;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-main);
  font-size: 0.95rem;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.filter-select {
  width: 100%;
  padding: 0.75rem 1rem;
  background: #111827;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: #ffffff;
  font-size: 0.95rem;
  cursor: pointer;
}

.filter-select option {
  background: #111827;
  color: #ffffff;
}

.search-btn {
  background: var(--primary);
  color: #000;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease;
  white-space: nowrap;
}

.search-btn:hover {
  background: #f59e0b;
}

/* Stats */
.stats-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.stat-item {
  text-align: center;
  min-width: 100px;
}

.stat-number {
  font-family: var(--font-heading);
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--primary);
  margin-bottom: 0.25rem;
}

.stat-number.loading {
  display: inline-block;
  width: 50px;
  height: 24px;
  background: linear-gradient(90deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.4), rgba(245, 158, 11, 0.2));
  background-size: 200% 100%;
  animation: loading 1.5s infinite ease-in-out;
  border-radius: 4px;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-divider {
  width: 1px;
  height: 30px;
  background: var(--border-color);
}

/* Responsive Design */
@media (max-width: 768px) {
  .car-slider {
    height: 50vh;
  }
  
  .car-title {
    font-size: clamp(2rem, 4vw, 2.5rem);
  }
  
  .car-details {
    gap: 1rem;
  }
  
  .search-filters {
    grid-template-columns: 1fr;
  }
  
  .stats-row {
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .stat-divider {
    display: none;
  }
}

@media (max-width: 480px) {
  .car-slider {
    height: 45vh;
  }
  
  .car-title {
    font-size: 1.8rem;
  }
  
  .car-price {
    font-size: 1.2rem;
  }
  
  .detail-item {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
  
  .slider-nav {
    gap: 1rem;
  }
  
  .nav-btn {
    width: 36px;
    height: 36px;
  }
}

.hero-content {
  max-width: 900px;
  width: 100%;
  text-align: center;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero-label {
  display: inline-block;
  background: var(--primary-glow);
  color: var(--primary);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: var(--radius-full);
  padding: 0.35rem 1rem;
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 1.5rem;
}

.hero-title {
  font-family: var(--font-heading);
  font-size: clamp(2rem, 5.5vw, 4.5rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin-bottom: 1.25rem;
  background: linear-gradient(135deg, #ffffff 35%, #d1d5db 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: #e5e7eb;
  margin-bottom: 2.5rem;
  max-width: 680px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.4);
}

.hero-search-box {
  padding: 1.5rem;
  max-width: 900px;
  margin: 0 auto 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  background: rgba(9, 13, 22, 0.7);
}

.hero-search-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 1rem;
  align-items: end;
}

.hero-search-btn {
  height: 46px;
  white-space: nowrap;
}

/* Hero Stats */
.hero-stats-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-top: 2.5rem;
  flex-wrap: wrap;
}

.hero-stat {
  text-align: center;
}

.hero-stat-num {
  font-family: var(--font-heading);
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--primary);
  text-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
}

.hero-stat:hover .hero-stat-num {
  transform: scale(1.05);
  text-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
}

.hero-stat::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 60%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary), transparent);
  transition: transform 0.3s ease;
}

.hero-stat:hover::after {
  transform: translateX(-50%) scaleX(1);
}

.loading-pulse {
  display: inline-block;
  width: 60px;
  height: 24px;
  background: linear-gradient(90deg, rgba(245, 158, 11, 0.3), rgba(245, 158, 11, 0.5), rgba(245, 158, 11, 0.3));
  background-size: 200% 100%;
  animation: pulse 1.5s infinite ease-in-out;
  border-radius: 4px;
}

@keyframes pulse {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.hero-stat-lbl {
  font-size: 0.82rem;
  color: #e5e7eb;
  font-weight: 600;
  margin-top: 0.15rem;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.3);
}

.hero-stat-divider {
  width: 1px;
  height: 40px;
  background: var(--border-color);
}

/* Why Strip */
.why-strip {
  background: var(--bg-surface);
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  padding: 2rem 0;
}

.why-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.why-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
}

.why-icon {
  font-size: 1.75rem;
  flex-shrink: 0;
}

.why-text {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.why-text strong {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-main);
}

.why-text span {
  font-size: 0.82rem;
  color: var(--text-muted);
}

/* Sections */
.section-padded {
  padding: 5rem 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-header-center {
  text-align: center;
  margin-bottom: 3rem;
}

.section-label {
  display: block;
  color: var(--primary);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.82rem;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
}

.section-title {
  font-family: var(--font-heading);
  font-size: clamp(1.6rem, 3.5vw, 2.4rem);
  font-weight: 800;
  margin-bottom: 0.75rem;
}

.section-sub {
  color: var(--text-muted);
  font-size: 1rem;
  max-width: 580px;
  margin: 0 auto;
}

.loading-state {
  text-align: center;
  padding: 4rem;
  color: var(--text-muted);
}

/* Categories Grid */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.category-card {
  padding: 2rem;
  cursor: pointer;
  transition: var(--transition);
}

.category-card:hover {
  border-color: var(--border-highlight);
  transform: translateY(-4px);
}

.cat-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.cat-name {
  font-family: var(--font-heading);
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.cat-desc {
  color: var(--text-muted);
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1.25rem;
}

.cat-cta {
  color: var(--primary);
  font-weight: 700;
  font-size: 0.9rem;
}

/* CTA Banner */
.cta-banner {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(6, 182, 212, 0.05));
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  padding: 5rem 0;
}

.cta-content {
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
}

.cta-title {
  font-family: var(--font-heading);
  font-size: clamp(1.6rem, 3.5vw, 2.5rem);
  font-weight: 800;
  margin-bottom: 1rem;
}

.cta-sub {
  color: var(--text-muted);
  font-size: 1.05rem;
  line-height: 1.7;
  margin-bottom: 2rem;
}

.cta-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* === RESPONSIVE === */
@media (max-width: 900px) {
  .hero-section { min-height: 75vh; padding: 4rem 1rem 3rem; }
  .hero-search-grid { grid-template-columns: 1fr 1fr; }
  .why-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 600px) {
  .hero-section { min-height: auto; padding: 3rem 1rem 2.5rem; }
  .hero-search-grid { grid-template-columns: 1fr; }
  .hero-stats-row { gap: 1.25rem; }
  .hero-stat-divider { display: none; }
  .why-grid { grid-template-columns: 1fr; }
  .section-padded { padding: 3rem 0; }
  .section-header { flex-direction: column; align-items: flex-start; }
  .cta-banner { padding: 3rem 0; }
}
</style>
