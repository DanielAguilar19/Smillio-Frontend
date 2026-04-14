import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import OdontologoView from '@/views/OdontologoView/O-home.vue'
import AgendaView from '@/views/OdontologoView/O-agenda.vue'
import PacientesView from '@/views/OdontologoView/O-pacientes.vue'
import ClinicasView from '@/views/OdontologoView/O-clinicas.vue'
import PerfilView from '@/views/OdontologoView/O-perfil.vue'

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
      path: '/o-home',
      name: 'odontologo-home',
      component: OdontologoView,
    },
    {
      path: '/o-agenda',
      name: 'odontologo-agenda',
      component: AgendaView,
    },
    {
      path: '/o-pacientes',
      name: 'odontologo-pacientes',
      component: PacientesView,
    },
    {
      path: '/o-clinicas',
      name: 'odontologo-clinicas',
      component: ClinicasView,
    },
    {
      path: '/o-perfil',
      name: 'odontologo-perfil',
      component: PerfilView,
    },

    ...rutasAuth,
  ],
})

export default router
