import OdontologoView from '@/views/OdontologoView/O-home.vue'
import AgendaView from '@/views/OdontologoView/O-agenda.vue'
import PacientesView from '@/views/OdontologoView/O-pacientes.vue'
import ClinicasView from '@/views/OdontologoView/O-clinicas.vue'
import PerfilView from '@/views/OdontologoView/O-perfil.vue'

export default [
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
