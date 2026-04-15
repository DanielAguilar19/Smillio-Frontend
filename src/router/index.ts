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
      component: () => import('../views/AboutView.vue'),
    },
    // Nuevas rutas para las vistas mencionadas
    {
      path: '/agenda',
      name: 'agenda',
      component: () => import('../views/AgendaView.vue'),
    },
    {
      path: '/ajustes',
      name: 'ajustes',
      component: () => import('../views/AjustesView.vue'),
    },
    {
      path: '/facturacion',
      name: 'facturacion',
      component: () => import('../views/FacturacionView.vue'),
    },
    {
      path: '/mi-clinica',
      name: 'mi-clinica',
      component: () => import('../views/MiClinicaView.vue'),
    },
    {
      path: '/pacientes',
      name: 'pacientes',
      component: () => import('../views/PacientesView.vue'),
    },
    {
      path: '/paciente/:id', // Ruta dinámica para el detalle
      name: 'paciente-detalle',
      component: () => import('../views/PacienteDetalleView.vue'),
    },
    {
      path: '/resenas',
      name: 'resenas',
      component: () => import('../views/ResenasView.vue'),
    },
    
    
    ...rutasAuth,
    ...rutasOdontologo,
  ],
})

export default router