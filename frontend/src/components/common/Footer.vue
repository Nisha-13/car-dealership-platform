<template>
  <footer class="public-footer">
    <div class="container">
      <div class="footer-grid">
        <!-- Brand Column -->
        <div class="footer-col brand-col">
          <div class="footer-brand">⚡ AUTO<span>LUXE</span></div>
          <p class="footer-desc">
            The premier luxury car dealership platform. Delivering world-class performance vehicles, bespoke service, and seamless digital showroom experiences.
          </p>

        </div>

        <!-- Quick Links -->
        <div class="footer-col">
          <h4 class="footer-title">Quick Links</h4>
          <ul class="footer-links">
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/cars">Vehicle Inventory</router-link></li>
            <li><router-link to="/categories">Categories</router-link></li>
            <li><router-link to="/compare">Compare Cars</router-link></li>
            <li><router-link to="/about">About AutoLuxe</router-link></li>
            <li><router-link to="/contact">Contact Dealer</router-link></li>
            <li><router-link to="/login">Sign In</router-link></li>
            <li><router-link to="/register">Get Started</router-link></li>
          </ul>
        </div>

        <!-- Hours -->
        <div class="footer-col">
          <h4 class="footer-title">Showroom Hours</h4>
          <ul class="footer-info">
            <li><span>Monday – Friday:</span> 09:00 AM – 08:00 PM</li>
            <li><span>Saturday:</span> 10:00 AM – 06:00 PM</li>
            <li><span>Sunday:</span> VIP By Appointment Only</li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="footer-col">
          <h4 class="footer-title">Headquarters</h4>
          <p class="footer-address">
            📍 777 Luxury Boulevard, Beverly Hills, CA 90210<br />
            📞 +1 (800) 555-LUXE<br />
            ✉️ vip-concierge@autoluxe.com
          </p>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© 2026 AutoLuxe Motors Inc. All Rights Reserved. Production Real-Time Platform.</p>
        <div class="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.public-footer {
  background: var(--bg-surface);
  border-top: 1px solid var(--border-color);
  padding: 4rem 0 2rem;
  margin-top: 5rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.4fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-brand {
  font-family: var(--font-heading);
  font-size: 1.4rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.footer-brand span {
  color: var(--primary);
}

.footer-desc {
  color: var(--text-muted);
  font-size: 0.9rem;
  line-height: 1.7;
  margin-bottom: 1.5rem;
}



.footer-title {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  color: var(--text-main);
}

.footer-links,
.footer-info {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.footer-links li {
  position: relative;
  padding-left: 0;
  transition: padding-left 0.2s ease;
}

.footer-links li:hover {
  padding-left: 5px;
}

.footer-links li:hover::before {
  content: '→';
  position: absolute;
  left: -15px;
  color: var(--primary);
}

.footer-links a {
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: var(--primary);
}

.footer-links a.router-link-active {
  color: var(--primary);
  font-weight: 600;
}

.footer-info span {
  color: var(--text-main);
  font-weight: 600;
  display: block;
}

.footer-address {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 2;
}

.footer-bottom {
  border-top: 1px solid var(--border-color);
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--text-dim);
}

.footer-bottom-links {
  display: flex;
  gap: 1.5rem;
}

.footer-bottom-links a:hover {
  color: var(--primary);
}

/* === TABLET === */
@media (max-width: 900px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .brand-col {
    grid-column: 1 / -1;
  }
}

/* === MOBILE === */
@media (max-width: 580px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 1.75rem;
  }

  .public-footer {
    padding: 3rem 0 1.5rem;
    margin-top: 3rem;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}
</style>
