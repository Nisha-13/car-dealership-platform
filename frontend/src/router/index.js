import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Layouts
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import CustomerLayout from '@/layouts/CustomerLayout.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';

// Public Views
import HomeView from '@/views/public/HomeView.vue';
import CarsView from '@/views/public/CarsView.vue';
import CarDetailView from '@/views/public/CarDetailView.vue';
import CategoriesView from '@/views/public/CategoriesView.vue';
import CompareView from '@/views/public/CompareView.vue';
import AboutView from '@/views/public/AboutView.vue';
import ContactView from '@/views/public/ContactView.vue';
import LoginView from '@/views/public/LoginView.vue';
import RegisterView from '@/views/public/RegisterView.vue';

// Customer Dashboard Views
import CustomerDashboardView from '@/views/customer/CustomerDashboardView.vue';
import CustomerReservationsView from '@/views/customer/CustomerReservationsView.vue';
import CustomerTestDrivesView from '@/views/customer/CustomerTestDrivesView.vue';
import CustomerFavoritesView from '@/views/customer/CustomerFavoritesView.vue';
import CustomerInquiriesView from '@/views/customer/CustomerInquiriesView.vue';
import CustomerMessagesView from '@/views/customer/CustomerMessagesView.vue';
import CustomerNotificationsView from '@/views/customer/CustomerNotificationsView.vue';
import CustomerProfileView from '@/views/customer/CustomerProfileView.vue';

// Admin Dashboard Views
import AdminDashboardView from '@/views/admin/AdminDashboardView.vue';
import AdminCarsView from '@/views/admin/AdminCarsView.vue';
import AdminCarFormView from '@/views/admin/AdminCarFormView.vue';
import AdminCategoriesView from '@/views/admin/AdminCategoriesView.vue';
import AdminReservationsView from '@/views/admin/AdminReservationsView.vue';
import AdminTestDrivesView from '@/views/admin/AdminTestDrivesView.vue';
import AdminInquiriesView from '@/views/admin/AdminInquiriesView.vue';
import AdminMessagesView from '@/views/admin/AdminMessagesView.vue';
import AdminNotificationsView from '@/views/admin/AdminNotificationsView.vue';
import AdminCustomersView from '@/views/admin/AdminCustomersView.vue';
import AdminActivityLogsView from '@/views/admin/AdminActivityLogsView.vue';

const routes = [
  // Public Showroom Routes
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'home', component: HomeView },
      { path: 'cars', name: 'cars', component: CarsView },
      { path: 'cars/:id', name: 'car-detail', component: CarDetailView },
      { path: 'categories', name: 'categories', component: CategoriesView },
      { path: 'compare', name: 'compare', component: CompareView },
      { path: 'about', name: 'about', component: AboutView },
      { path: 'contact', name: 'contact', component: ContactView },
      { path: 'login', name: 'login', component: LoginView, meta: { guestOnly: true } },
      { path: 'register', name: 'register', component: RegisterView, meta: { guestOnly: true } }
    ]
  },

  // Customer Dashboard Routes
  {
    path: '/dashboard',
    component: CustomerLayout,
    meta: { requiresAuth: true, role: 'customer' },
    children: [
      { path: '', name: 'customer-dashboard', component: CustomerDashboardView },
      { path: 'reservations', name: 'customer-reservations', component: CustomerReservationsView },
      { path: 'test-drives', name: 'customer-test-drives', component: CustomerTestDrivesView },
      { path: 'favorites', name: 'customer-favorites', component: CustomerFavoritesView },
      { path: 'inquiries', name: 'customer-inquiries', component: CustomerInquiriesView },
      { path: 'messages', name: 'customer-messages', component: CustomerMessagesView },
      { path: 'notifications', name: 'customer-notifications', component: CustomerNotificationsView },
      { path: 'profile', name: 'customer-profile', component: CustomerProfileView }
    ]
  },

  // Admin / Dealer Dashboard Routes
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', name: 'admin-dashboard', component: AdminDashboardView },
      { path: 'cars', name: 'admin-cars', component: AdminCarsView },
      { path: 'cars/create', name: 'admin-car-create', component: AdminCarFormView },
      { path: 'cars/:id/edit', name: 'admin-car-edit', component: AdminCarFormView },
      { path: 'reservations', name: 'admin-reservations', component: AdminReservationsView },
      { path: 'categories', name: 'admin-categories', component: AdminCategoriesView },
      { path: 'test-drives', name: 'admin-test-drives', component: AdminTestDrivesView },
      { path: 'inquiries', name: 'admin-inquiries', component: AdminInquiriesView },
      { path: 'messages', name: 'admin-messages', component: AdminMessagesView },
      { path: 'notifications', name: 'admin-notifications', component: AdminNotificationsView },
      { path: 'customers', name: 'admin-customers', component: AdminCustomersView },
      { path: 'activity-logs', name: 'admin-activity-logs', component: AdminActivityLogsView }
    ]
  },

  // Fallback redirect
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    if (authStore.isAdmin) return next('/admin/dashboard');
    return next('/dashboard');
  }

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      return next({ name: 'login', query: { redirect: to.fullPath } });
    }

    if (to.meta.role && authStore.user.role !== to.meta.role) {
      if (authStore.isAdmin) return next('/admin/dashboard');
      return next('/dashboard');
    }
  }

  next();
});

export default router;
