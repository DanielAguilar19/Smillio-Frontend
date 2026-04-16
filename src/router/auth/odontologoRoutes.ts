export default [
  {
    path: '/o-home',
    name: 'odontologo-home',
    component: () => import('@/views/OdontologoView/O-home.vue'),
    meta: { requiresAuth: true, roles: ['ODONTOLOGO'] },
  },
  {
    path: '/o-agenda',
    name: 'odontologo-agenda',
    component: () => import('@/views/OdontologoView/O-agenda.vue'),
    meta: { requiresAuth: true, roles: ['ODONTOLOGO'] },
  },
  {
    path: '/o-pacientes',
    name: 'odontologo-pacientes',
    component: () => import('@/views/OdontologoView/O-pacientes.vue'),
    meta: { requiresAuth: true, roles: ['ODONTOLOGO'] },
  },
  {
    path: '/o-clinicas',
    name: 'odontologo-clinicas',
    component: () => import('@/views/OdontologoView/O-clinicas.vue'),
    meta: { requiresAuth: true, roles: ['ODONTOLOGO'] },
  },
  {
    path: '/o-perfil',
    name: 'odontologo-perfil',
    component: () => import('@/views/OdontologoView/O-perfil.vue'),
    meta: { requiresAuth: true, roles: ['ODONTOLOGO'] },
  },
]
