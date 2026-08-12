<template>
  <div>
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem;">
      <div>
        <h2 style="font-family:var(--font-heading); font-size:1.5rem; font-weight:700;">Vehicle Categories</h2>
        <p style="color:var(--text-muted); font-size:0.9rem;">Organize inventory into shopper-friendly browsing categories.</p>
      </div>
      <button @click="showForm = true" class="btn btn-primary btn-sm">+ Add Category</button>
    </div>

    <!-- Add Form -->
    <div v-if="showForm" class="glass-panel" style="padding:2rem; margin-bottom:2rem; max-width:600px;">
      <h3 style="font-family:var(--font-heading); font-size:1.2rem; font-weight:700; margin-bottom:1.5rem;">New Category</h3>
      <form @submit.prevent="handleCreate">
        <div class="form-group">
          <label class="form-label">Category Name *</label>
          <input v-model="newCat.name" type="text" class="form-input" required placeholder="Sports & Performance" />
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea v-model="newCat.description" class="form-textarea" rows="2" placeholder="Short description of this category..."></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Icon Name (Emoji or identifier)</label>
          <input v-model="newCat.icon" type="text" class="form-input" placeholder="🏎️" />
        </div>
        <div style="display:flex; gap:0.75rem; justify-content:flex-end; margin-top:0.5rem;">
          <button type="button" @click="showForm = false" class="btn btn-secondary">Cancel</button>
          <button type="submit" class="btn btn-primary">Create Category</button>
        </div>
      </form>
    </div>

    <div class="glass-panel" style="padding:1.5rem;">
      <div class="table-responsive" v-if="carStore.categories.length">
        <table class="data-table">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Slug</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cat in carStore.categories" :key="cat._id">
              <td style="font-weight:700;">{{ cat.icon || '🏎️' }} {{ cat.name }}</td>
              <td style="color:var(--text-muted); font-size:0.85rem; font-family:monospace;">{{ cat.slug }}</td>
              <td style="color:var(--text-muted); font-size:0.88rem;">{{ cat.description }}</td>
              <td>
                <button @click="handleDelete(cat._id)" class="btn btn-danger btn-sm">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else style="text-align:center; padding:3rem; color:var(--text-muted);">
        No categories found.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCarStore } from '@/stores/car';
import { createCategoryApi, deleteCategoryApi } from '@/api/car.api';
import { useToast } from '@/composables/useToast';

const carStore = useCarStore();
const { showToast } = useToast();

const showForm = ref(false);
const newCat = ref({ name: '', description: '', icon: '🏎️' });

const handleCreate = async () => {
  try {
    await createCategoryApi(newCat.value);
    showToast('Category created!', 'success');
    newCat.value = { name: '', description: '', icon: '🏎️' };
    showForm.value = false;
    carStore.fetchCategories();
  } catch (err) {
    showToast(err.message || 'Error creating category.', 'error');
  }
};

const handleDelete = async (id) => {
  if (!confirm('Delete this category? Vehicles assigned to it will need reassignment.')) return;
  try {
    await deleteCategoryApi(id);
    showToast('Category deleted.', 'info');
    carStore.fetchCategories();
  } catch (err) {
    showToast('Error deleting category.', 'error');
  }
};

onMounted(() => {
  carStore.fetchCategories();
});
</script>
