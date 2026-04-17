import { createRouter, createWebHistory } from 'vue-router'

import ComponentsView from '../views/ComponentsView.vue'
import HomeView from '../views/HomeView.vue'
import SettingsView from '../views/SettingsView.vue'
import AboutView from '../views/AboutView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/components',
    name: 'Components',
    component: ComponentsView,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView,
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
