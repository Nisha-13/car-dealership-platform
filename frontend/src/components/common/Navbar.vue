<template>
  <!-- Overlay backdrop (visible on mobile when menu is open) -->
  <div class="nav-backdrop" :class="{ visible: mobileOpen }" @click="closeMobile"></div>

  <header class="public-navbar">
    <div class="container navbar-inner">
      <!-- Brand -->
      <router-link to="/" class="nav-brand" @click="closeMobile">
        <span>⚡</span>
        <span>AUTO<span class="brand-accent">LUXE</span></span>
      </router-link>

      <!-- Desktop Nav Links -->
      <nav class="nav-links" :class="{ 'is-open': mobileOpen }">
        <router-link to="/"          class="nav-item" @click="closeMobile">Home</router-link>
        <router-link to="/cars"      class="nav-item" @click="closeMobile">Inventory</router-link>
        <router-link to="/categories"class="nav-item" @click="closeMobile">Categories</router-link>
        <router-link to="/compare"   class="nav-item" @click="closeMobile">
          Compare
          <span v-if="compareStore.compareList.length" class="nav-badge">{{ compareStore.compareList.length }}</span>
        </router-link>
        <router-link to="/about"   class="nav-item" @click="closeMobile">About</router-link>
        <router-link to="/contact" class="nav-item" @click="closeMobile">Contact</router-link>

        <!-- Mobile-only auth section (shown inside drawer) -->
        <div class="mobile-auth">
          <template v-if="authStore.isAuthenticated">
            <router-link
              :to="authStore.isAdmin ? '/admin/dashboard' : '/dashboard'"
              class="btn btn-primary"
              style="justify-content:center;"
              @click="closeMobile"
            >Dashboard</router-link>
            <button @click="handleLogout" class="btn btn-secondary" style="justify-content:center;">Logout</button>
          </template>
          <template v-else>
            <router-link to="/login"    class="btn btn-secondary" style="justify-content:center;" @click="closeMobile">Sign In</router-link>
            <router-link to="/register" class="btn btn-primary"   style="justify-content:center;" @click="closeMobile">Get Started</router-link>
          </template>
        </div>
      </nav>

      <!-- Right Side -->
      <div class="nav-right">
        <!-- Desktop auth buttons -->
        <div class="desktop-auth">
          <template v-if="authStore.isAuthenticated">
            <router-link
              :to="authStore.isAdmin ? '/admin/dashboard' : '/dashboard'"
              class="btn btn-primary btn-sm"
            >Dashboard</router-link>
            <button @click="handleLogout" class="btn btn-secondary btn-sm">Logout</button>
          </template>
          <template v-else>
            <router-link to="/login"    class="btn btn-secondary btn-sm">Sign In</router-link>
            <router-link to="/register" class="btn btn-primary btn-sm">Get Started</router-link>
          </template>
        </div>

        <!-- Hamburger button -->
        <button
          class="hamburger"
          @click="mobileOpen = !mobileOpen"
          :aria-expanded="mobileOpen"
          aria-label="Toggle navigation"
        >
          <span class="hamburger-line" :class="{ 'line-top-open': mobileOpen }"></span>
          <span class="hamburger-line" :class="{ 'line-mid-open': mobileOpen }"></span>
          <span class="hamburger-line" :class="{ 'line-bot-open': mobileOpen }"></span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCompareStore } from '@/stores/compare';

const authStore = useAuthStore();
const compareStore = useCompareStore();
const router = useRouter();
const mobileOpen = ref(false);

const closeMobile = () => { mobileOpen.value = false; };

const handleLogout = () => {
  authStore.logout();
  closeMobile();
  router.push('/');
};

// Close on Escape key
const onKeydown = (e) => { if (e.key === 'Escape') closeMobile(); };
onMounted(() => window.addEventListener('keydown', onKeydown));
onUnmounted(() => window.removeEventListener('keydown', onKeydown));
</script>

<style scoped>
/* ── BACKDROP ── */
.nav-backdrop {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 298;
  backdrop-filter: blur(2px);
  opacity: 0;
  transition: opacity 0.25s ease;
}
.nav-backdrop.visible {
  opacity: 1;
}

/* ── HEADER ── */
.public-navbar {
  position: sticky;
  top: 0;
  z-index: 299;
  background: rgba(9, 13, 22, 0.93);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);
  height: 68px;
  display: flex;
  align-items: center;
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  width: 100%;
}

/* ── BRAND ── */
.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-family: var(--font-heading);
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  flex-shrink: 0;
  white-space: nowrap;
}
.brand-accent { color: var(--primary); }

/* ── NAV LINKS ── */
.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex: 1;
  justify-content: center;
}

.nav-item {
  position: relative;
  font-size: 0.93rem;
  font-weight: 600;
  color: var(--text-muted);
  transition: color 0.2s;
  white-space: nowrap;
}
.nav-item:hover,
.nav-item.router-link-active {
  color: var(--text-main);
}
.nav-item.router-link-exact-active::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary);
  border-radius: 2px;
}

/* ── NAV BADGE ── */
.nav-badge {
  background: var(--primary);
  color: #000;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 0.08rem 0.38rem;
  border-radius: 999px;
  margin-left: 0.2rem;
  vertical-align: middle;
}

/* ── RIGHT SIDE ── */
.nav-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.desktop-auth {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

/* Hide mobile-only drawer section on desktop */
.mobile-auth { display: none; }

/* ── HAMBURGER ── */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.06);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition);
  flex-shrink: 0;
}
.hamburger:hover { background: rgba(255,255,255,0.12); }

.hamburger-line {
  display: block;
  width: 20px;
  height: 2px;
  background: #fff;
  border-radius: 2px;
  transition: var(--transition);
  transform-origin: center;
}

/* Animated X state */
.line-top-open { transform: translateY(7px) rotate(45deg); }
.line-mid-open { opacity: 0; transform: scaleX(0); }
.line-bot-open { transform: translateY(-7px) rotate(-45deg); }

/* ═══════════════════════════════════
   TABLET  ≤ 1024px
   ═══════════════════════════════════ */
@media (max-width: 1024px) {
  .nav-links { gap: 1.35rem; }
}

/* ═══════════════════════════════════
   MOBILE  ≤ 768px
   ═══════════════════════════════════ */
@media (max-width: 768px) {
  /* Show backdrop */
  .nav-backdrop { display: block; pointer-events: none; }
  .nav-backdrop.visible { pointer-events: auto; }

  /* Show hamburger */
  .hamburger { display: flex; }

  /* Hide desktop auth */
  .desktop-auth { display: none; }

  /* Show mobile-auth inside the drawer */
  .mobile-auth {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
    padding-top: 1.5rem;
    margin-top: 1.5rem;
    border-top: 1px solid var(--border-color);
  }

  /* Nav links become a slide-down mobile drawer */
  .nav-links {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    gap: 0;

    position: fixed;
    top: 68px;
    left: 0;
    right: 0;
    z-index: 299;

    background: rgba(9, 13, 22, 0.98);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-bottom: 1px solid var(--border-color);
    padding: 1rem 1.25rem 1.5rem;

    max-height: 0;
    overflow: hidden;
    opacity: 0;
    pointer-events: none;
    transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1),
                opacity    0.25s ease,
                padding    0.25s ease;
  }

  .nav-links.is-open {
    max-height: 90vh;
    overflow-y: auto;
    opacity: 1;
    pointer-events: auto;
  }

  /* Individual nav items in mobile */
  .nav-item {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-main);
    padding: 0.95rem 0;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .nav-item:last-of-type { border-bottom: none; }

  .nav-item.router-link-exact-active {
    color: var(--primary);
  }

  .nav-item.router-link-exact-active::after { display: none; }
}

/* ═══════════════════════════════════
   SMALL MOBILE  ≤ 400px
   ═══════════════════════════════════ */
@media (max-width: 400px) {
  .nav-brand { font-size: 1.15rem; }
  .public-navbar { height: 60px; }
  .nav-links { top: 60px; }
}
</style>
