<template>
  <div class="categories-page">
    <!-- Hero -->
    <section class="cat-hero">
      <div class="container">
        <span class="cat-tag">Explore Our Collection</span>
        <h1 class="cat-title">Vehicle Categories</h1>
        <p class="cat-sub">Explore our specialized automotive categories engineered to fulfill every luxury lifestyle and performance requirement.</p>
      </div>
    </section>

    <!-- Category Grid -->
    <section class="container cat-grid-section">
      <div v-if="carStore.loading" class="cat-loading">
        <div style="font-size:2.5rem; margin-bottom:1rem;">⟳</div>
        <p style="color:var(--text-muted);">Loading categories...</p>
      </div>

      <div v-else-if="!carStore.categories.length" class="glass-panel cat-empty">
        <p style="color:var(--text-muted);">No categories found.</p>
      </div>

      <div v-else class="cat-grid">
        <div
          v-for="cat in carStore.categories"
          :key="cat._id"
          class="cat-card glass-panel"
          @click="router.push({ name: 'cars', query: { category: cat.slug } })"
        >
          <div class="cat-card-img-wrap">
            <img
              :src="cat.image || catImages[cat.slug] || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80'"
              :alt="cat.name"
              class="cat-card-img"
              loading="lazy"
            />
            <div class="cat-card-overlay"></div>
            <div class="cat-card-badge">{{ cat.icon || '🏎️' }}</div>
          </div>
          <div class="cat-card-body">
            <h3 class="cat-card-name">{{ cat.name }}</h3>
            <p class="cat-card-desc">{{ cat.description }}</p>
            <span class="cat-card-cta">View Collection →</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCarStore } from '@/stores/car';

const carStore = useCarStore();
const router = useRouter();

// Fallback images per category slug
const catImages = {
  'luxury-sedans':  'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
  'suvs':           'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80',
  'electric-hybrid':'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80',
  'sports':         'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
};

onMounted(() => carStore.fetchCategories());
</script>

<style scoped>
.categories-page { padding-bottom: 5rem; }

/* Hero */
.cat-hero {
  padding: 4.5rem 0 3.5rem;
  text-align: center;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 3.5rem;
}

.cat-tag {
  display: inline-block;
  color: var(--accent-cyan);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  margin-bottom: 0.85rem;
}

.cat-title {
  font-family: var(--font-heading);
  font-size: clamp(1.8rem, 5vw, 3rem);
  font-weight: 800;
  margin-bottom: 1rem;
}

.cat-sub {
  color: var(--text-muted);
  font-size: clamp(0.9rem, 2vw, 1.05rem);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.7;
}

/* Grid */
.cat-grid-section { }

.cat-loading, .cat-empty {
  text-align: center;
  padding: 4rem 2rem;
}

.cat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.75rem;
}

/* Card */
.cat-card {
  overflow: hidden;
  cursor: pointer;
  transition: var(--transition);
  padding: 0;
}

.cat-card:hover {
  transform: translateY(-6px);
  border-color: var(--border-highlight);
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}

.cat-card-img-wrap {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #000;
}

.cat-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.cat-card:hover .cat-card-img {
  transform: scale(1.07);
}

.cat-card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.55) 100%);
}

.cat-card-badge {
  position: absolute;
  top: 0.85rem;
  left: 0.85rem;
  font-size: 1.6rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
}

.cat-card-body {
  padding: 1.5rem;
}

.cat-card-name {
  font-family: var(--font-heading);
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.cat-card-desc {
  color: var(--text-muted);
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1.1rem;
}

.cat-card-cta {
  color: var(--primary);
  font-weight: 700;
  font-size: 0.88rem;
}

/* Responsive */
@media (max-width: 600px) {
  .cat-hero { padding: 3rem 0 2.5rem; margin-bottom: 2rem; }
  .cat-grid { grid-template-columns: 1fr; gap: 1.25rem; }
  .cat-card-img-wrap { height: 180px; }
}
</style>
