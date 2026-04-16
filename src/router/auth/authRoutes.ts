export default [
  {
    path: '/registro-paciente',
    name: 'registro-paciente',
    component: () => import('@/features/pacientes/registroPaciente.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/features/auth/login.vue'),
    meta: { requiresAuth: false },
  },
]
