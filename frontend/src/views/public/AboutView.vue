<template>
  <div class="about-page">
    <!-- Hero -->
    <section class="about-hero">
      <div class="container">
        <span class="section-tag">Bespoke Excellence Since 2010</span>
        <h1 class="about-title">Redefining the Luxury Automotive Experience</h1>
        <p class="about-sub">AutoLuxe is a world leader in high-end automotive sales, connecting discerning enthusiasts with elite supercars, luxury executive sedans, and revolutionary electric hyper-vehicles.</p>
      </div>
    </section>

    <!-- Value Cards -->
    <section class="container about-cards-section">
      <div class="about-cards-grid">
        <div class="glass-panel about-card" v-for="card in valueCards" :key="card.icon">
          <div class="about-card-icon">{{ card.icon }}</div>
          <h3 class="about-card-title">{{ card.title }}</h3>
          <p class="about-card-desc">{{ card.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Stats Banner -->
    <section class="about-stats-banner">
      <div class="container">
        <div class="about-stats-grid" ref="statsBannerRef">
          <div class="about-stat" v-for="(s, i) in stats" :key="s.num">
            <div class="about-stat-num">{{ s.display }}</div>
            <div class="about-stat-lbl">{{ s.lbl }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team / Mission -->
    <section class="container about-mission-section">
      <div class="about-mission-grid">
        <div>
          <span class="section-tag">Our Mission</span>
          <h2 class="about-mission-title">More Than a Dealership — A Lifestyle Ecosystem</h2>
          <p class="about-mission-text">We go beyond traditional automotive retail. Our real-time digital platform connects buyers with the finest vehicles, backed by live dealer concierge support, Socket.IO-powered instant communication, and a seamless end-to-end ownership journey.</p>
          <div class="about-mission-features">
            <div class="about-mission-feat" v-for="f in features" :key="f">✓ {{ f }}</div>
          </div>
        </div>
        <div class="about-image-panel glass-panel">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80"
            alt="AutoLuxe Showroom"
            style="width:100%; height:100%; object-fit:cover; border-radius:var(--radius-md);"
          />
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="container about-cta-section">
      <div class="glass-panel about-cta">
        <h2 class="about-cta-title">Experience the AutoLuxe Difference</h2>
        <p class="about-cta-sub">Explore our showroom and book a VIP test drive today.</p>
        <div class="about-cta-btns">
          <router-link to="/cars" class="btn btn-primary btn-lg">Browse Fleet</router-link>
          <router-link to="/contact" class="btn btn-secondary btn-lg">Contact Concierge</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';

const valueCards = [
  { icon: '🏆', title: 'Certified Quality', desc: 'Every vehicle undergoes a 150-point technical inspection by certified master technicians before entering our VIP showroom.' },
  { icon: '⚡', title: 'Real-Time Platform', desc: 'Our Socket.IO platform enables direct live chat with dealership directors and instant test drive confirmations in real-time.' },
  { icon: '🔑', title: 'White-Glove Service', desc: 'Enclosed climate-controlled transport directly to your private estate with full orientation by our concierge team.' },
  { icon: '💎', title: 'Exclusive Inventory', desc: 'Access to ultra-limited editions, factory-ordered configurations, and pre-owned certified hyper-vehicles worldwide.' },
];

// Reactive stats — filled from API
const stats = reactive([
  { target: null, suffix: '+', lbl: 'Vehicles Delivered',   display: '...' },
  { target: null, suffix: '+', lbl: 'Exclusive Brands',     display: '...' },
  { target: null, suffix: '%', lbl: 'Customer Satisfaction', display: '...' },
  { target: null, suffix: '',  lbl: 'Live Dealer Support',  display: '24/7' },
]);

const statsBannerRef = ref(null);
const statsLoaded = ref(false);
let observer = null;

function animateCounter(stat, duration = 1800) {
  if (stat.target === null) return; // static value — skip
  const start = performance.now();
  const to = stat.target;
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(to * eased);
    stat.display = current + stat.suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function startAnimationsIfReady() {
  if (statsLoaded.value) {
    stats.forEach(s => animateCounter(s));
    if (observer) observer.disconnect();
  }
}

async function fetchPublicStats() {
  try {
    const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const res  = await fetch(`${base}/api/stats/public`);
    const json = await res.json();
    if (json.success && json.data) {
      const d = json.data;
      stats[0].target = d.vehiclesDelivered ?? 0;
      stats[1].target = d.exclusiveBrands   ?? 0;
      stats[2].target = d.satisfactionPct   ?? 98;
      // stats[3] stays 24/7
    }
  } catch {
    // Fallback if API is down
    stats[0].target = 0;
    stats[1].target = 0;
    stats[2].target = 98;
  } finally {
    statsLoaded.value = true;
    startAnimationsIfReady();
  }
}

onMounted(() => {
  fetchPublicStats();

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) startAnimationsIfReady();
    },
    { threshold: 0.3 }
  );
  if (statsBannerRef.value) observer.observe(statsBannerRef.value);
});

onUnmounted(() => { if (observer) observer.disconnect(); });

const features = [
  'Live Socket.IO customer-dealer chat',
  'Real-time test drive booking & confirmation',
  'BullMQ background email & reminder workers',
  'JWT-secured role-based customer accounts',
  'Multi-vehicle side-by-side comparison matrix',
  'Personalized favorites & inquiry tracking',
];
</script>

<style scoped>
.about-page { padding-bottom: 5rem; }

/* Hero */
.about-hero {
  padding: 5rem 0 4rem;
  text-align: center;
  background: linear-gradient(180deg, rgba(245,158,11,0.04) 0%, transparent 100%);
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 4rem;
}

.section-tag {
  display: inline-block;
  color: var(--primary);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  margin-bottom: 1rem;
}

.about-title {
  font-family: var(--font-heading);
  font-size: clamp(1.8rem, 5vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 1.25rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.about-sub {
  color: var(--text-muted);
  font-size: clamp(0.95rem, 2vw, 1.1rem);
  line-height: 1.75;
  max-width: 680px;
  margin: 0 auto;
}

/* Cards */
.about-cards-section { margin-bottom: 4rem; }

.about-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.about-card {
  padding: 2rem;
  transition: var(--transition);
}

.about-card:hover {
  border-color: var(--border-highlight);
  transform: translateY(-4px);
}

.about-card-icon { font-size: 2.5rem; margin-bottom: 1rem; }

.about-card-title {
  font-family: var(--font-heading);
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.6rem;
}

.about-card-desc {
  color: var(--text-muted);
  font-size: 0.92rem;
  line-height: 1.65;
}

/* Stats Banner */
.about-stats-banner {
  background: var(--bg-surface);
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  padding: 3rem 0;
  margin-bottom: 4rem;
}

.about-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  text-align: center;
}

.about-stat-num {
  font-family: var(--font-heading);
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--primary);
  margin-bottom: 0.3rem;
}

.about-stat-lbl {
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 600;
}

/* Mission */
.about-mission-section { margin-bottom: 4rem; }

.about-mission-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.about-mission-title {
  font-family: var(--font-heading);
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 800;
  margin: 0.75rem 0 1rem;
  line-height: 1.25;
}

.about-mission-text {
  color: var(--text-muted);
  font-size: 0.97rem;
  line-height: 1.75;
  margin-bottom: 1.5rem;
}

.about-mission-features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.65rem;
}

.about-mission-feat {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.about-mission-feat::before {
  content: '';
}

.about-image-panel {
  height: 420px;
  overflow: hidden;
  padding: 0;
}

/* CTA */
.about-cta-section { margin-top: 1rem; }

.about-cta {
  padding: 3.5rem 2rem;
  text-align: center;
  background: linear-gradient(135deg, rgba(245,158,11,0.08), rgba(6,182,212,0.04));
}

.about-cta-title {
  font-family: var(--font-heading);
  font-size: clamp(1.5rem, 3.5vw, 2.2rem);
  font-weight: 800;
  margin-bottom: 0.75rem;
}

.about-cta-sub {
  color: var(--text-muted);
  margin-bottom: 2rem;
  font-size: 1rem;
}

.about-cta-btns {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  .about-stats-grid { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
  .about-mission-grid { grid-template-columns: 1fr; gap: 2rem; }
  .about-image-panel { height: 280px; }
  .about-mission-features { grid-template-columns: 1fr; }
}

@media (max-width: 600px) {
  .about-hero { padding: 3rem 0 2.5rem; margin-bottom: 2.5rem; }
  .about-stats-grid { grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
  .about-stat-num { font-size: 1.7rem; }
  .about-cta { padding: 2.5rem 1.25rem; }
  .about-cards-grid { gap: 1rem; }
}
</style>
