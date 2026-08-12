<template>
  <div class="contact-page">
    <!-- Hero -->
    <section class="contact-hero">
      <div class="container">
        <span class="contact-tag">Get In Touch</span>
        <h1 class="contact-title">Contact AutoLuxe Concierge</h1>
        <p class="contact-sub">Whether you are seeking custom vehicle sourcing, financing solutions, or a private test drive experience, our dealer team is available to assist you.</p>
      </div>
    </section>

    <div class="container contact-body">
      <div class="contact-grid">
        <!-- Info Column -->
        <div class="contact-info-col">
          <div class="contact-info-card glass-panel" v-for="info in contactInfo" :key="info.icon">
            <div class="info-icon">{{ info.icon }}</div>
            <div>
              <div class="info-label">{{ info.label }}</div>
              <div class="info-value">{{ info.value }}</div>
            </div>
          </div>

          <!-- Showroom Hours -->
          <div class="glass-panel hours-card">
            <h3 class="hours-title">🕐 Showroom Hours</h3>
            <div class="hours-row" v-for="h in hours" :key="h.day">
              <span class="hours-day">{{ h.day }}</span>
              <span class="hours-time">{{ h.time }}</span>
            </div>
          </div>
        </div>

        <!-- Form Column -->
        <div class="glass-panel contact-form-card">
          <h2 class="form-title">Send a General Inquiry</h2>
          <p class="form-sub" style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1.75rem;">Fill in the form below and a dedicated concierge will respond within 1 business hour.</p>

          <form @submit.prevent="handleSubmit">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input v-model="form.name" type="text" class="form-input" required placeholder="John Doe" />
              </div>
              <div class="form-group">
                <label class="form-label">Phone Number</label>
                <input v-model="form.phone" type="text" class="form-input" required placeholder="+1 (555) 000-0000" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input v-model="form.email" type="email" class="form-input" required placeholder="john@example.com" />
            </div>

            <div class="form-group">
              <label class="form-label">Subject</label>
              <select v-model="form.subject" class="form-select">
                <option value="Test Drive Inquiry">Test Drive Inquiry</option>
                <option value="Vehicle Availability">Vehicle Availability</option>
                <option value="Financing & Leasing">Financing & Leasing</option>
                <option value="Trade-In Valuation">Trade-In Valuation</option>
                <option value="General Inquiry">General Inquiry</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Message</label>
              <textarea v-model="form.message" class="form-textarea" rows="4" required placeholder="How can we assist you today?"></textarea>
            </div>

            <button type="submit" class="btn btn-primary btn-full" :disabled="submitted">
              {{ submitted ? '✓ Message Sent! We\'ll be in touch.' : 'Submit Message' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from '@/composables/useToast';

const { showToast } = useToast();
const submitted = ref(false);

const form = ref({ name: '', phone: '', email: '', subject: 'General Inquiry', message: '' });

const contactInfo = [
  { icon: '📍', label: 'Showroom Headquarters', value: '777 Luxury Boulevard, Beverly Hills, CA 90210' },
  { icon: '📞', label: 'VIP Direct Phone',      value: '+1 (800) 555-LUXE · +1 (310) 555-0199' },
  { icon: '✉️', label: 'Email Concierge',       value: 'vip-concierge@autoluxe.com' },
];

const hours = [
  { day: 'Monday – Friday', time: '09:00 AM – 08:00 PM' },
  { day: 'Saturday',        time: '10:00 AM – 06:00 PM' },
  { day: 'Sunday',          time: 'VIP By Appointment' },
];

const handleSubmit = () => {
  showToast('Thank you! Our concierge will contact you within 1 hour.', 'success');
  submitted.value = true;
  form.value = { name: '', phone: '', email: '', subject: 'General Inquiry', message: '' };
  setTimeout(() => (submitted.value = false), 4000);
};
</script>

<style scoped>
.contact-page { padding-bottom: 5rem; }

/* Hero */
.contact-hero {
  padding: 4.5rem 0 3.5rem;
  text-align: center;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 3.5rem;
}

.contact-tag {
  display: inline-block;
  color: var(--primary);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  margin-bottom: 0.85rem;
}

.contact-title {
  font-family: var(--font-heading);
  font-size: clamp(1.8rem, 5vw, 3rem);
  font-weight: 800;
  margin-bottom: 1rem;
}

.contact-sub {
  color: var(--text-muted);
  font-size: clamp(0.9rem, 2vw, 1.05rem);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.7;
}

/* Body Grid */
.contact-body { }

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: 2.5rem;
  align-items: start;
}

/* Info Column */
.contact-info-col {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.contact-info-card {
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: var(--transition);
}

.contact-info-card:hover {
  border-color: var(--border-highlight);
}

.info-icon { font-size: 1.75rem; flex-shrink: 0; margin-top: 0.1rem; }
.info-label { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem; }
.info-value { font-weight: 600; font-size: 0.93rem; line-height: 1.5; }

.hours-card {
  padding: 1.5rem;
}

.hours-title {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.hours-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.88rem;
  gap: 1rem;
}

.hours-row:last-child { border-bottom: none; }
.hours-day { color: var(--text-muted); font-weight: 600; }
.hours-time { color: var(--text-main); font-weight: 700; text-align: right; }

/* Form Card */
.contact-form-card {
  padding: 2.5rem;
}

.form-title {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

/* Responsive */
@media (max-width: 900px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

@media (max-width: 600px) {
  .contact-hero { padding: 3rem 0 2.5rem; margin-bottom: 2rem; }
  .contact-form-card { padding: 1.5rem 1.25rem; }
  .form-row { grid-template-columns: 1fr; }
}
</style>
