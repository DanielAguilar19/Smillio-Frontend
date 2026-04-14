export default [
  {
    path: '/registro-paciente',
    name: 'registro-paciente',
    component: () => import('@/features/pacientes/registroPaciente.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/features/auth/login.vue'),
  },
  /*
    {
      path: '/disciplinas',
      name: 'disciplinas',
      component: () => import('@/views/disciplinasView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/cursos',
      name: 'cursos',
      component: () => import('@/views/cursosView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/reservas',
      name: 'reservas',
      component: () => import('@/views/reservasView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: () => import('@/views/perfilView.vue'),
      meta: { requiresAuth: true }
    },
    */
]
