<template>
  <div>
    <div style="margin-bottom:2rem;">
      <h2 style="font-family:var(--font-heading); font-size:1.5rem; font-weight:700;">
        {{ isEditing ? 'Edit Vehicle Details' : 'Add New Luxury Vehicle' }}
      </h2>
      <p style="color:var(--text-muted); font-size:0.9rem;">Complete all fields to accurately represent the vehicle in the showroom.</p>
    </div>

    <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
      <div class="admin-form-grid">
        <!-- Left Column -->
        <div class="glass-panel" style="padding:2rem;">
          <h3 style="font-family:var(--font-heading); font-size:1.1rem; font-weight:700; margin-bottom:1.5rem; color:var(--primary);">Vehicle Identity</h3>

          <div class="form-group">
            <label class="form-label">Full Title *</label>
            <input v-model="form.title" type="text" class="form-input" required placeholder="e.g. 2024 Porsche Taycan Turbo S" />
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <div class="form-group">
              <label class="form-label">Brand *</label>
              <input v-model="form.brand" type="text" class="form-input" required placeholder="Porsche" />
            </div>
            <div class="form-group">
              <label class="form-label">Model *</label>
              <input v-model="form.model" type="text" class="form-input" required placeholder="Taycan Turbo S" />
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <div class="form-group">
              <label class="form-label">Year *</label>
              <input v-model="form.year" type="number" class="form-input" required min="1990" max="2030" />
            </div>
            <div class="form-group">
              <label class="form-label">Price ($) *</label>
              <input v-model="form.price" type="number" class="form-input" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Category *</label>
            <select v-model="form.category" class="form-select" required>
              <option value="" disabled>Select vehicle category</option>
              <option v-for="cat in carStore.categories" :key="cat._id" :value="cat._id">{{ cat.name }}</option>
            </select>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <div class="form-group">
              <label class="form-label">Fuel Type *</label>
              <select v-model="form.fuelType" class="form-select" required>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Transmission *</label>
              <select v-model="form.transmission" class="form-select" required>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <div class="form-group">
              <label class="form-label">Mileage (miles) *</label>
              <input v-model="form.mileage" type="number" class="form-input" required />
            </div>
            <div class="form-group">
              <label class="form-label">Color *</label>
              <input v-model="form.color" type="text" class="form-input" required placeholder="Frozen Blue Metallic" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Engine / Motor</label>
            <input v-model="form.engine" type="text" class="form-input" placeholder="4.4L Twin-Turbo V8" />
          </div>

          <div class="form-group">
            <label class="form-label">Availability Status</label>
            <select v-model="form.status" class="form-select">
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
              <option value="Sold">Sold</option>
            </select>
          </div>

          <div class="form-group">
            <label style="display:flex; align-items:center; gap:0.75rem; cursor:pointer;">
              <input type="checkbox" v-model="form.featured" style="accent-color:var(--primary); width:18px; height:18px;" />
              <span class="form-label" style="margin:0;">Feature on Homepage Showcase</span>
            </label>
          </div>
        </div>

        <!-- Right Column -->
        <div style="display:flex; flex-direction:column; gap:2rem;">
          <div class="glass-panel" style="padding:2rem;">
            <h3 style="font-family:var(--font-heading); font-size:1.1rem; font-weight:700; margin-bottom:1.5rem; color:var(--primary);">Description & Features</h3>

            <div class="form-group">
              <label class="form-label">Full Description *</label>
              <textarea v-model="form.description" class="form-textarea" rows="5" required placeholder="Detailed luxury vehicle description..."></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Features (comma-separated)</label>
              <textarea v-model="featuresText" class="form-textarea" rows="3" placeholder="Active Suspension, Carbon Fiber Roof, 360 Camera..."></textarea>
            </div>
          </div>

          <div class="glass-panel" style="padding:2rem;">
            <h3 style="font-family:var(--font-heading); font-size:1.1rem; font-weight:700; margin-bottom:1.5rem; color:var(--primary);">Performance Specifications</h3>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
              <div class="form-group">
                <label class="form-label">Horsepower</label>
                <input v-model="form.specifications.horsepower" type="text" class="form-input" placeholder="750 HP" />
              </div>
              <div class="form-group">
                <label class="form-label">Acceleration (0-60 mph)</label>
                <input v-model="form.specifications.acceleration" type="text" class="form-input" placeholder="0-60 mph in 2.6s" />
              </div>
              <div class="form-group">
                <label class="form-label">Top Speed</label>
                <input v-model="form.specifications.topSpeed" type="text" class="form-input" placeholder="162 mph" />
              </div>
              <div class="form-group">
                <label class="form-label">Drivetrain</label>
                <input v-model="form.specifications.drivetrain" type="text" class="form-input" placeholder="AWD / RWD" />
              </div>
              <div class="form-group">
                <label class="form-label">Seating Capacity</label>
                <input v-model="form.specifications.seatingCapacity" type="number" class="form-input" placeholder="5" />
              </div>
              <div class="form-group">
                <label class="form-label">Number of Doors</label>
                <input v-model="form.specifications.doors" type="number" class="form-input" placeholder="4" />
              </div>
            </div>
          </div>

          <div class="glass-panel" style="padding:2rem;">
            <h3 style="font-family:var(--font-heading); font-size:1.1rem; font-weight:700; margin-bottom:1.5rem; color:var(--primary);">Vehicle Images</h3>

            <div class="form-group">
              <label class="form-label">Upload Images (max 8, JPEG/PNG/WebP)</label>
              <input type="file" @change="handleFileChange" accept="image/*" multiple class="form-input" style="padding:0.5rem;" />
              <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.35rem;">Max 5MB per file</div>
            </div>

            <div v-if="existingImages.length" style="margin-top:1rem;">
              <label class="form-label">Current Images</label>
              <div style="display:flex; gap:0.75rem; flex-wrap:wrap; margin-top:0.5rem;">
                <img
                  v-for="(img, i) in existingImages"
                  :key="i"
                  :src="img"
                  style="width:80px; height:60px; object-fit:cover; border-radius:4px; border:1px solid var(--border-color);"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style="margin-top:2rem; display:flex; gap:1rem; justify-content:flex-end;">
        <router-link to="/admin/cars" class="btn btn-secondary btn-lg">Cancel</router-link>
        <button type="submit" class="btn btn-primary btn-lg" :disabled="saving">
          {{ saving ? 'Saving Vehicle...' : (isEditing ? 'Update Vehicle' : 'Create Vehicle') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCarStore } from '@/stores/car';
import { createCarApi, updateCarApi } from '@/api/car.api';
import { getCarByIdApi } from '@/api/car.api';
import { useToast } from '@/composables/useToast';

const carStore = useCarStore();
const route = useRoute();
const router = useRouter();
const { showToast } = useToast();

const saving = ref(false);
const existingImages = ref([]);
const selectedFiles = ref([]);

const isEditing = computed(() => !!route.params.id);

const form = ref({
  title: '',
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  price: '',
  category: '',
  mileage: 0,
  fuelType: 'Petrol',
  transmission: 'Automatic',
  engine: '',
  color: '',
  description: '',
  status: 'Available',
  featured: false,
  specifications: {
    horsepower: '',
    acceleration: '',
    topSpeed: '',
    drivetrain: '',
    seatingCapacity: 5,
    doors: 4
  }
});

const featuresText = ref('');

const handleFileChange = (e) => {
  selectedFiles.value = Array.from(e.target.files);
};

const handleSubmit = async () => {
  saving.value = true;
  try {
    const formData = new FormData();

    Object.entries(form.value).forEach(([key, val]) => {
      if (key === 'specifications') {
        formData.append(key, JSON.stringify(val));
      } else {
        formData.append(key, val);
      }
    });

    const features = featuresText.value.split(',').map(f => f.trim()).filter(Boolean);
    formData.append('features', JSON.stringify(features));

    selectedFiles.value.forEach(file => {
      formData.append('images', file);
    });

    if (isEditing.value) {
      await updateCarApi(route.params.id, formData);
      showToast('Vehicle updated successfully!', 'success');
    } else {
      await createCarApi(formData);
      showToast('New vehicle added to inventory!', 'success');
    }

    router.push('/admin/cars');
  } catch (err) {
    showToast(err.message || 'Error saving vehicle.', 'error');
  } finally {
    saving.value = false;
  }
};

onMounted(async () => {
  await carStore.fetchCategories();

  if (isEditing.value) {
    try {
      const res = await getCarByIdApi(route.params.id);
      const car = res.data;
      form.value = {
        title: car.title,
        brand: car.brand,
        model: car.model,
        year: car.year,
        price: car.price,
        category: car.category?._id || car.category,
        mileage: car.mileage,
        fuelType: car.fuelType,
        transmission: car.transmission,
        engine: car.engine,
        color: car.color,
        description: car.description,
        status: car.status,
        featured: car.featured,
        specifications: car.specifications || {}
      };
      featuresText.value = (car.features || []).join(', ');
      existingImages.value = car.images || [];
    } catch (err) {
      showToast('Failed to load vehicle for editing.', 'error');
    }
  }
});
</script>

<style scoped>
.admin-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
@media (max-width: 900px) {
  .admin-form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
