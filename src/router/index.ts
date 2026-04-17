import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ClinicaDashboardLayout from '@/layouts/ClinicaDashboardLayout.vue'
import rutasOdontologo from './auth/odontologoRoutes'
import rutasAuth from './auth/authRoutes'

// Helper: ruta home según rol
export function getHomeParaRol(rol: string): string {
  switch (rol) {
    case 'PACIENTE':
      return '/busqueda-clinicas'
    case 'CLINICA':
      return '/dashboard'
    case 'ODONTOLOGO':
      return '/o-home'
    case 'ADMIN':
      return '/admin'
    default:
      return '/'
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ── Públicas ───────────────────────────────────────────────────
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

    // ── Paciente ───────────────────────────────────────────────────
    {
      path: '/busqueda-clinicas',
      name: 'busqueda-clinicas',
      component: () => import('../views/BusquedaClinicasView.vue'),
      meta: { requiresAuth: true, roles: ['PACIENTE'] },
    },
    {
      path: '/clinica/:id',
      name: 'detalle-clinica',
      component: () => import('../views/DetalleClinicaView.vue'),
      meta: { requiresAuth: true, roles: ['PACIENTE'] },
    },
    {
      path: '/mis-citas',
      name: 'mis-citas',
      component: () => import('../views/MisCitasView.vue'),
      meta: { requiresAuth: true, roles: ['PACIENTE'] },
    },

    // ── Registro odontólogo (pública) ──────────────────────────────
    {
      path: '/registro-odontologo',
      name: 'registro-odontologo',
      component: () => import('../views/RegistroOdontologoView.vue'),
    },

    // ── Dashboard clínica (con layout) ─────────────────────────────
    {
      path: '/dashboard',
      component: ClinicaDashboardLayout,
      meta: { requiresAuth: true, roles: ['CLINICA'] },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('../views/DashboardClinicaView.vue'),
        },
        {
          path: '/agenda',
          name: 'agenda',
          component: () => import('../views/AgendaView.vue'),
        },
        {
          path: '/pacientes',
          name: 'pacientes',
          component: () => import('../views/Pacientesview.vue'),
        },
        {
          path: '/pacientes/:id',
          name: 'paciente-detalle',
          component: () => import('../views/Pacientedetalleview.vue'),
        },
        {
          path: '/facturacion',
          name: 'facturacion',
          component: () => import('../views/Facturacionview.vue'),
        },
        {
          path: '/resenas',
          name: 'resenas',
          component: () => import('../views/Resenasview.vue'),
        },
        {
          path: '/mi-clinica',
          name: 'mi-clinica',
          component: () => import('../views/Miclinicaview.vue'),
        },
        {
          path: '/ajustes',
          name: 'ajustes',
          component: () => import('../views/Ajustesview.vue'),
        },
      ],
    },

    // ── Admin ──────────────────────────────────────────────────────
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      meta: { requiresAuth: true, roles: ['ADMIN'] },
    },

    // ── Auth ───────────────────────────────────────────────────────
    ...rutasAuth,

    // ── Odontólogo ─────────────────────────────────────────────────
    ...rutasOdontologo,

    // ── Catch-all ──────────────────────────────────────────────────
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

// ── Navigation guard ───────────────────────────────────────────────
/*router.beforeEach((to, _from, next) => {
  const storedUser = localStorage.getItem('user')
  const user = storedUser ? JSON.parse(storedUser) : null
  const isAuthenticated = !!user
  const rol: string = user?.rol || ''

  // Revisar todos los registros de ruta coincidentes (padre + hijo)
  const requiresAuth = to.matched.some(r => r.meta?.requiresAuth === true)
  const rolesPermitidos = to.matched
    .map(r => r.meta?.roles as string[] | undefined)
    .find(roles => roles && roles.length > 0)

  // Redirigir al login si la ruta requiere auth y no está logueado
  if (requiresAuth && !isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  // Si está logueado e intenta acceder al login → mandarlo a su home
  if (to.name === 'login' && isAuthenticated) {
    return next(getHomeParaRol(rol))
  }

  // Verificar que el rol tenga permiso a la ruta
  if (rolesPermitidos && !rolesPermitidos.includes(rol)) {
    return next(getHomeParaRol(rol))
  }

  next()
})
*/
export default router
