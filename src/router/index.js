import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'calendar', component: () => import('../views/CalendarView.vue') },
  { path: '/bookings', name: 'bookings', component: () => import('../views/BookingsView.vue') },
  { path: '/bookings/new', name: 'new-booking', component: () => import('../views/BookingFormView.vue') },
  { path: '/resources', name: 'resources', component: () => import('../views/ResourcesView.vue') },
  { path: '/stats', name: 'stats', component: () => import('../views/StatsView.vue') },
  { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') }
]

export default createRouter({ history: createWebHistory(), routes })
