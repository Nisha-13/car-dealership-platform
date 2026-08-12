import { ref } from 'vue';

const toasts = ref([]);

export function useToast() {
  const showToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    toasts.value.push({ id, message, type });

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  };

  return {
    toasts,
    showToast,
    removeToast
  };
}
