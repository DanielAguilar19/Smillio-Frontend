<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useClinicaDashboardStore } from '@/stores/clinicaDashboardStore'
import { obtenerHistorialPaciente } from '@/api/historial/historialApi'

const route  = useRoute()
const router = useRouter()
const store  = useClinicaDashboardStore()

const pacienteId = computed(() => Number(route.params.id))
const paciente = computed(() => store.getPaciente(pacienteId.value))
const historial = ref<any[]>([])
const loadingHistorial = ref(false)

const citasPaciente = computed(() =>
  store.citas.filter(c => c.pacienteId === pacienteId.value || c.pacienteId === String(pacienteId.value))
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
)

onMounted(async () => {
  if (pacienteId.value) {
    loadingHistorial.value = true
    try {
      const res = await obtenerHistorialPaciente(pacienteId.value)
      historial.value = res.data || []
    } catch {
      historial.value = []
    } finally {
      loadingHistorial.value = false
    }
  }
})

const tabActiva = ref('historial')
const tabs = [
  { id: 'historial',  label: 'Historial clínico' },
  { id: 'citas',      label: 'Citas' },
  { id: 'info',       label: 'Información personal' }
]

const edad = computed(() => {
  if (!paciente.value?.fechaNacimiento) return '—'
  const hoy  = new Date(2025, 3, 13)
  const nac  = new Date(paciente.value.fechaNacimiento)
  let años   = hoy.getFullYear() - nac.getFullYear()
  const m    = hoy.getMonth() - nac.getMonth()
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) años--
  return `${años} años`
})

const estadoBadge = { confirmada: 'badge-success', pendiente: 'badge-warning', completada: 'badge-info' }
</script>

<template>
  <div v-if="paciente">

    <!-- Back -->
    <button class="btn btn-ghost btn-sm" @click="router.push('/pacientes')" style="margin-bottom:0.5rem">
      <i class="pi pi-arrow-left"></i> Volver a pacientes
    </button>

    <!-- Header del paciente -->
    <div class="card card-pad">
      <div style="display:flex;align-items:flex-start;gap:1.25rem;flex-wrap:wrap">
        <div :class="['avatar avatar-xl', `avatar-${paciente.avatarColor}`]">
          {{ paciente.nombre[0] }}{{ paciente.apellido[0] }}
        </div>

        <div style="flex:1;min-width:200px">
          <div style="font-size:22px;font-weight:600;color:var(--neutral-800)">
            {{ paciente.nombre }} {{ paciente.apellido }}
          </div>
          <div class="text-sm text-muted" style="margin-top:3px">
            {{ paciente.sexo === 'F' ? 'Femenina' : 'Masculino' }} · {{ edad }} · Sangre {{ paciente.tipoSangre || '—' }}
          </div>
          <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">
            <span class="badge badge-neutral"><i class="pi pi-envelope" style="font-size:10px"></i> {{ paciente.email }}</span>
            <span class="badge badge-neutral"><i class="pi pi-phone" style="font-size:10px"></i> {{ paciente.telefono }}</span>
            <span v-if="paciente.alergias?.length" class="badge badge-danger">
              <i class="pi pi-exclamation-triangle" style="font-size:10px"></i>
              Alergia: {{ paciente.alergias.join(', ') }}
            </span>
            <span v-if="paciente.enfermedades?.length" class="badge badge-warning">
              {{ paciente.enfermedades.join(', ') }}
            </span>
          </div>
        </div>

        <div style="display:flex;gap:8px">
          <button class="btn btn-outline btn-sm"><i class="pi pi-calendar"></i> Agendar cita</button>
          <button class="btn btn-brand btn-sm"><i class="pi pi-file"></i> Nueva nota</button>
        </div>
      </div>

      <!-- Stats rápidas -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-top:1.25rem;padding-top:1.25rem;border-top:1px solid var(--neutral-150)">
        <div>
          <div class="stat-label">Visitas totales</div>
          <div style="font-size:20px;font-weight:600;color:var(--neutral-800)">{{ historial.length }}</div>
        </div>
        <div>
          <div class="stat-label">Paciente desde</div>
          <div style="font-size:20px;font-weight:600;color:var(--neutral-800)">{{ paciente.fechaRegistro?.split('-')[0] || '—' }}</div>
        </div>
        <div>
          <div class="stat-label">Total gastado</div>
          <div style="font-size:20px;font-weight:600;color:var(--neutral-800)">
            L. {{ historial.reduce((s, h) => s + (h.costo || 0), 0).toLocaleString() }}
          </div>
        </div>
        <div>
          <div class="stat-label">Valoración</div>
          <div style="font-size:20px;font-weight:600;color:var(--neutral-800)">
            <template v-if="paciente.rating">
              <span class="stars">{{ '★'.repeat(paciente.rating) }}</span>
              <span class="stars-empty">{{ '★'.repeat(5 - paciente.rating) }}</span>
            </template>
            <span v-else class="text-muted">—</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs-bar">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="{ active: tabActiva === tab.id }"
        @click="tabActiva = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Historial clínico -->
    <div v-if="tabActiva === 'historial'">
      <div v-if="loadingHistorial" style="padding:2rem;text-align:center;color:var(--neutral-400)">
        <i class="pi pi-spin pi-spinner" style="font-size:24px"></i>
      </div>
      <div v-else-if="historial.length" style="display:flex;flex-direction:column;gap:1rem">
        <div v-for="h in historial" :key="h.id" class="card card-pad">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:1rem">
            <div style="flex:1">
              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
                <span class="text-base font-medium">{{ h.tratamiento || h.descripcion }}</span>
                <span class="badge badge-success">Completado</span>
              </div>
              <div class="text-sm text-muted" style="margin-top:4px">
                {{ h.fecha }} · {{ h.odontologo || '—' }}
              </div>
              <div class="text-sm" style="margin-top:8px;color:var(--neutral-600);line-height:1.6">
                {{ h.descripcion }}
              </div>
            </div>
            <div v-if="h.costo" style="text-align:right;flex-shrink:0">
              <div class="text-xs text-muted">Costo</div>
              <div class="text-base font-medium">L. {{ h.costo.toLocaleString() }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="card card-pad" style="text-align:center;color:var(--neutral-400);padding:3rem">
        <i class="pi pi-file" style="font-size:32px;margin-bottom:0.5rem;display:block"></i>
        Sin historial clínico aún
      </div>
    </div>

    <!-- Citas -->
    <div v-if="tabActiva === 'citas'" class="card" style="overflow:hidden">
      <table class="data-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Servicio</th>
            <th>Duración</th>
            <th>Estado</th>
            <th>Notas</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in citasPaciente" :key="c.id">
            <td>{{ c.fecha }}</td>
            <td>{{ c.hora }}</td>
            <td class="text-sm font-medium">{{ c.servicio }}</td>
            <td>{{ c.duracion }} min</td>
            <td>
              <span :class="['badge', estadoBadge[c.estado] || 'badge-neutral']">{{ c.estado }}</span>
            </td>
            <td class="text-sm text-muted">{{ c.notas || '—' }}</td>
          </tr>
          <tr v-if="!citasPaciente.length">
            <td colspan="6" style="text-align:center;padding:2rem;color:var(--neutral-400)">Sin citas registradas</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Info personal -->
    <div v-if="tabActiva === 'info'" class="card card-pad">
      <div class="info-grid">
        <div class="info-field"><div class="info-label">Nombre completo</div><div class="info-value">{{ paciente.nombre }} {{ paciente.apellido }}</div></div>
        <div class="info-field"><div class="info-label">Sexo</div><div class="info-value">{{ paciente.sexo === 'F' ? 'Femenino' : 'Masculino' }}</div></div>
        <div class="info-field"><div class="info-label">Fecha de nacimiento</div><div class="info-value">{{ paciente.fechaNacimiento || '—' }}</div></div>
        <div class="info-field"><div class="info-label">Edad</div><div class="info-value">{{ edad }}</div></div>
        <div class="info-field"><div class="info-label">Email</div><div class="info-value">{{ paciente.email }}</div></div>
        <div class="info-field"><div class="info-label">Teléfono</div><div class="info-value">{{ paciente.telefono }}</div></div>
        <div class="info-field"><div class="info-label">Tipo de sangre</div><div class="info-value">{{ paciente.tipoSangre || '—' }}</div></div>
        <div class="info-field"><div class="info-label">Alergias</div><div class="info-value">{{ paciente.alergias?.join(', ') || 'Ninguna' }}</div></div>
        <div class="info-field"><div class="info-label">Enfermedades</div><div class="info-value">{{ paciente.enfermedades?.join(', ') || 'Ninguna' }}</div></div>
        <div class="info-field"><div class="info-label">Fecha de registro</div><div class="info-value">{{ paciente.fechaRegistro }}</div></div>
      </div>
    </div>

  </div>

  <div v-else class="card card-pad" style="text-align:center;padding:4rem;color:var(--neutral-400)">
    Paciente no encontrado. <RouterLink to="/pacientes" style="color:var(--brand-500)">Volver</RouterLink>
  </div>
</template>

<style scoped>
.tabs-bar {
  display: flex; gap: 4px;
  border-bottom: 1px solid var(--neutral-150);
  background: var(--neutral-0);
  padding: 0 0.25rem;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}
.tabs-bar button {
  padding: 10px 16px; font-size: 13px;
  background: transparent; border: none;
  color: var(--neutral-500); position: relative;
  transition: color .15s;
}
.tabs-bar button:hover { color: var(--neutral-700); }
.tabs-bar button.active { color: var(--brand-600); font-weight: 500; }
.tabs-bar button.active::after {
  content: ''; position: absolute; bottom: 0; left: 0; right: 0;
  height: 2px; background: var(--brand-500); border-radius: 99px;
}

.info-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;
}
.info-label { font-size: 12px; color: var(--neutral-400); margin-bottom: 3px; }
.info-value  { font-size: 14px; color: var(--neutral-800); font-weight: 500; }
</style>  