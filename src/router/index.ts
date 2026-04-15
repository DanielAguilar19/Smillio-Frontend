import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import rutasOdontologo from './auth/odontologoRoutes'

import rutasAuth from './auth/authRoutes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },



  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
  },

  {
    path: '/agenda',
    name: 'Agenda',
    component: () => import('../views/AgendaView.vue'),
  },
  {
    path: '/pacientes',
    name: 'Pacientes',
    component: () => import('../views/PacientesView.vue')
  },
  {
    path: '/pacientes/:id',
    name: 'PacienteDetalle',
    component: () => import('../views/PacienteDetalleView.vue')
  },
  {
    path: '/facturacion',
    name: 'Facturacion',
    component: () => import('../views/FacturacionView.vue')
  },
  {
    path: '/resenas',
    name: 'Resenas',
    component: () => import('../views/ResenasView.vue')
  },
  {
    path: '/clinica',
    name: 'MiClinica',
    component: () => import('../views/MiClinicaView.vue')
  },
  {
    path: '/ajustes',
    name: 'Ajustes',
    component: () => import('../views/AjustesView.vue')
  }

  ],
})

export default router
