<template>
  <div>
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem;">
      <div>
        <h2 style="font-family:var(--font-heading); font-size:1.5rem; font-weight:700;">Vehicle Inventory Management</h2>
        <p style="color:var(--text-muted); font-size:0.9rem;">Add, edit, inspect, and update availability status for all showroom vehicles.</p>
      </div>
      <router-link to="/admin/cars/create" class="btn btn-primary btn-sm">+ Add New Vehicle</router-link>
    </div>

    <div class="glass-panel" style="padding:1.5rem;">
      <div class="table-responsive" v-if="carStore.cars.length">
        <table class="data-table">
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Category</th>
              <th>Price</th>
              <th>Fuel / Powertrain</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="car in carStore.cars" :key="car._id">
              <td>
                <div style="display:flex; align-items:center; gap:0.85rem;">
                  <img :src="car.images?.[0] || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=200&q=80'" style="width:54px; height:38px; object-fit:cover; border-radius:4px;" />
                  <div>
                    <div style="font-weight:700;">{{ car.title }}</div>
                    <div style="font-size:0.8rem; color:var(--text-muted);">{{ car.brand }} ({{ car.year }})</div>
                  </div>
                </div>
              </td>
              <td>{{ car.category?.name || 'Category' }}</td>
              <td style="font-weight:700; color:var(--primary);">${{ car.price?.toLocaleString() }}</td>
              <td>{{ car.fuelType }} ({{ car.transmission }})</td>
              <td>
                <select
                  :value="car.status"
                  @change="handleStatusChange(car._id, $event.target.value)"
                  class="form-select"
                  style="padding:0.25rem 0.5rem; font-size:0.82rem;"
                >
                  <option value="Available">Available</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Sold">Sold</option>
                </select>
              </td>
              <td>
                <div style="display:flex; gap:0.5rem;">
                  <router-link :to="`/admin/cars/${car._id}/edit`" class="btn btn-secondary btn-sm">Edit</router-link>
                  <button @click="handleDelete(car._id)" class="btn btn-danger btn-sm">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else style="text-align:center; padding:4rem; color:var(--text-muted);">
        No cars currently in inventory. Click "+ Add New Vehicle" to add one.
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useCarStore } from '@/stores/car';
import { updateCarApi, deleteCarApi } from '@/api/car.api';
import { useToast } from '@/composables/useToast';

const carStore = useCarStore();
const { showToast } = useToast();

const handleStatusChange = async (id, status) => {
  try {
    await updateCarApi(id, { status });
    showToast(`Car status updated to ${status}`, 'success');
    carStore.fetchCars();
  } catch (err) {
    showToast('Failed to update car status.', 'error');
  }
};

const handleDelete = async (id) => {
  if (!confirm('Are you sure you want to delete this vehicle from inventory?')) return;
  try {
    await deleteCarApi(id);
    showToast('Vehicle deleted from inventory.', 'info');
    carStore.fetchCars();
  } catch (err) {
    showToast('Failed to delete car.', 'error');
  }
};

onMounted(() => {
  carStore.fetchCars({ limit: 100 });
});
</script>
