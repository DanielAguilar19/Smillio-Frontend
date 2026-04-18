<template>
  <div class="odo-page">

    <nav class="odo-sidebar">
      <div class="odo-logo">
        <img src="@/assets/smilio-logo-blue.png" class="w-100" />
      </div>
      <div class="odo-nav">
        <Button @click="router.push('/o-home')" label="Home" icon="pi pi-home" text class="odo-btn" />
        <Button @click="router.push('/o-agenda')" label="Agenda" icon="pi pi-calendar" text class="odo-btn" />
        <Button label="Pacientes" icon="pi pi-users" text class="odo-btn odo-btn-active" />
        <Button @click="router.push('/o-clinicas')" label="Clínicas" icon="pi pi-building" text class="odo-btn" />
      </div>
      <div class="odo-nav-bottom">
        <Button @click="router.push('/o-perfil')" label="Mi Perfil" icon="pi pi-cog" text class="odo-btn" />
        <Button @click="cerrarSesion" label="Salir" icon="pi pi-sign-out" text class="odo-btn odo-btn-danger" />
      </div>
    </nav>

    <main class="odo-content">

      <div class="odo-topbar">
        <h1 class="odo-title">Mis Pacientes</h1>
        <span class="p-input-icon-left">
          <i class="pi pi-search" style="color:#94a3b8"></i>
          <InputText v-model="busqueda" placeholder="Buscar paciente..." class="w-64" />
        </span>
      </div>

      <div v-if="loading" class="odo-loading">
        <ProgressSpinner />
      </div>

      <div v-else class="odo-table-card">
        <DataTable :value="pacientesFiltrados" :rows="15" paginator
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
          :rowsPerPageOptions="[10, 15, 25]" dataKey="pacienteId" stripedRows class="p-datatable-sm">
          <template #empty>
            <div class="odo-empty">
              <i class="pi pi-users" style="font-size:2.5rem;color:#94a3b8;display:block;margin-bottom:8px"></i>
              No tienes pacientes con citas registradas
            </div>
          </template>

          <Column field="pacienteNombre" header="Paciente" sortable>
            <template #body="{ data }">
              <div class="odo-pac-cell">
                <div class="odo-pac-avatar">{{ iniciales(data.pacienteNombre) }}</div>
                <span style="font-weight:600">{{ data.pacienteNombre }}</span>
              </div>
            </template>
          </Column>

          <Column field="servicio" header="Último servicio" />

          <Column field="fecha" header="Última cita" sortable>
            <template #body="{ data }">{{ formatFecha(data.fecha) }}</template>
          </Column>

          <Column field="clinicaNombre" header="Clínica" />

          <Column field="estado" header="Estado">
            <template #body="{ data }">
              <span :class="['odo-badge', estadoClass(data.estado)]">{{ data.estado }}</span>
            </template>
          </Column>
        </DataTable>
      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ProgressSpinner from 'primevue/progressspinner'
import { useAuthStore } from '@/stores/authStore'
import { useOdontologoStore } from '@/stores/odontologoStore'
import { useCitasStore } from '@/stores/citasStore'

const router = useRouter()
const authStore = useAuthStore()
const odontologoStore = useOdontologoStore()
const citasStore = useCitasStore()

const loading = ref(true)
const busqueda = ref('')

const pacientesUnicos = computed(() => {
  const seen = new Set<number>()
  const result: any[] = []
  const sorted = [...citasStore.misCitas].sort((a, b) =>
    (b.fecha + b.hora).localeCompare(a.fecha + a.hora)
  )
  for (const cita of sorted) {
    if (!seen.has(cita.pacienteId)) {
      seen.add(cita.pacienteId)
      result.push(cita)
    }
  }
  return result
})

const pacientesFiltrados = computed(() => {
  if (!busqueda.value) return pacientesUnicos.value
  const q = busqueda.value.toLowerCase()
  return pacientesUnicos.value.filter(c =>
    c.pacienteNombre?.toLowerCase().includes(q) ||
    c.servicio?.toLowerCase().includes(q)
  )
})

const iniciales = (nombre: string) => {
  if (!nombre) return '?'
  return nombre.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase()
}

const formatFecha = (fecha: string) => {
  if (!fecha) return '—'
  return new Date(fecha + 'T00:00').toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

const estadoClass = (estado: string) => {
  if (estado === 'COMPLETADA') return 'odo-badge-completada'
  if (estado === 'CANCELADA') return 'odo-badge-cancelada'
  if (estado === 'CONFIRMADA') return 'odo-badge-confirmada'
  return 'odo-badge-default'
}

const cerrarSesion = () => {
  authStore.logout()
  router.push('/')
}

onMounted(async () => {
  try {
    if (authStore.user?.id) {
      if (!odontologoStore.miOdontologo) {
        await odontologoStore.cargarMiOdontologo(authStore.user.id)
      }
      if (odontologoStore.miOdontologo?.id) {
        await citasStore.cargarCitasOdontologo(odontologoStore.miOdontologo.id)
      }
    }
  } catch (e) {
    console.error('Error cargando pacientes', e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* ── Estructura ──────────────────────────────────── */
.odo-page {
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background: #f8fafc;
}

/* ── Sidebar ─────────────────────────────────────── */
.odo-sidebar {
  width: 240px;
  min-width: 240px;
  background: #16529e;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.odo-logo {
  padding: 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, .12);
  flex-shrink: 0;
}

.odo-logo img {
  height: 80px;
  object-fit: contain;
  display: block;
}

.odo-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0.75rem 0.5rem;
  flex: 1;
}

.odo-nav-bottom {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0.75rem 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, .1);
}

:deep(.odo-btn.p-button) {
  width: 100% !important;
  justify-content: flex-start !important;
  color: rgba(255, 255, 255, .8) !important;
  padding: 0.6rem 0.875rem !important;
  background: transparent !important;
  border: none !important;
  border-radius: 8px !important;
  font-size: 13.5px !important;
  font-weight: 500 !important;
  gap: 10px !important;
}

:deep(.odo-btn.p-button:hover) {
  background: rgba(255, 255, 255, .13) !important;
  color: #fff !important;
}

:deep(.odo-btn.p-button .p-button-icon) {
  color: inherit !important;
  font-size: 15px !important;
  margin-right: 0 !important;
}

:deep(.odo-btn-active.p-button) {
  background: rgba(255, 255, 255, .2) !important;
  color: #fff !important;
  font-weight: 600 !important;
}

:deep(.odo-btn-danger.p-button) {
  color: #fca5a5 !important;
}

/* ── Contenido ───────────────────────────────────── */
.odo-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.odo-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.odo-title {
  font-size: 1.375rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.odo-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.odo-table-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, .06);
  overflow: hidden;
}

.odo-empty {
  text-align: center;
  padding: 2rem;
  color: #94a3b8;
}

/* ── Paciente celda ──────────────────────────────── */
.odo-pac-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.odo-pac-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #dbeafe;
  color: #1d4ed8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

/* ── Badges ──────────────────────────────────────── */
.odo-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 9999px;
  display: inline-block;
}

.odo-badge-confirmada {
  background: #dbeafe;
  color: #1d4ed8;
}

.odo-badge-completada {
  background: #dcfce7;
  color: #15803d;
}

.odo-badge-cancelada {
  background: #fee2e2;
  color: #b91c1c;
}

.odo-badge-default {
  background: #f1f5f9;
  color: #64748b;
}
</style>
