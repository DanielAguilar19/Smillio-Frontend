<template>
  <div class="odo-page">

    <nav class="odo-sidebar">
      <div class="odo-logo">
        <img src="@/assets/smilio-logo-blue.png" class="w-100" />
      </div>
      <div class="odo-nav">
        <Button @click="router.push('/o-home')" label="Home" icon="pi pi-home" text class="odo-btn" />
        <Button label="Agenda" icon="pi pi-calendar" text class="odo-btn odo-btn-active" />
        <Button @click="router.push('/o-pacientes')" label="Pacientes" icon="pi pi-users" text class="odo-btn" />
        <Button @click="router.push('/o-clinicas')" label="Clínicas" icon="pi pi-building" text class="odo-btn" />
      </div>
      <div class="odo-nav-bottom">
        <Button @click="router.push('/o-perfil')" label="Mi Perfil" icon="pi pi-cog" text class="odo-btn" />
        <Button @click="cerrarSesion" label="Salir" icon="pi pi-sign-out" text class="odo-btn odo-btn-danger" />
      </div>
    </nav>

    <main class="odo-content">

      <div class="odo-topbar">
        <h1 class="odo-title">Mi Agenda</h1>
        <Select v-model="filtroEstado" :options="estadoOpciones" optionLabel="label" optionValue="value"
          placeholder="Filtrar por estado" class="w-48" />
      </div>

      <div v-if="loading" class="odo-loading">
        <ProgressSpinner />
      </div>

      <div v-else class="odo-calendar-card">
        <FullCalendar :options="calendarOptions" />
      </div>

      <!-- Dialog detalle cita -->
      <Dialog v-model:visible="dialogCita" header="Detalle de cita" modal :style="{ width: '480px' }"
        :draggable="false">
        <div v-if="citaSeleccionada" class="odo-dialog-body">
          <div class="odo-dialog-patient">
            <div class="odo-avatar-icon">
              <i class="pi pi-user" style="color:white;font-size:1.2rem"></i>
            </div>
            <div>
              <p style="font-weight:700;margin:0;color:#1e293b">{{ citaSeleccionada.pacienteNombre }}</p>
              <p style="font-size:13px;color:#64748b;margin:0">{{ citaSeleccionada.servicio }}</p>
            </div>
          </div>

          <div class="odo-detail-grid">
            <div class="odo-detail-item">
              <i class="pi pi-calendar" style="color:#3b82f6;margin-top:2px"></i>
              <div>
                <p style="font-size:11px;color:#94a3b8;margin:0">Fecha</p>
                <p style="font-weight:600;margin:0">{{ formatFecha(citaSeleccionada.fecha) }}</p>
              </div>
            </div>
            <div class="odo-detail-item">
              <i class="pi pi-clock" style="color:#3b82f6;margin-top:2px"></i>
              <div>
                <p style="font-size:11px;color:#94a3b8;margin:0">Hora</p>
                <p style="font-weight:600;margin:0">{{ citaSeleccionada.hora }}</p>
              </div>
            </div>
            <div class="odo-detail-item">
              <i class="pi pi-building" style="color:#3b82f6;margin-top:2px"></i>
              <div>
                <p style="font-size:11px;color:#94a3b8;margin:0">Clínica</p>
                <p style="font-weight:600;margin:0">{{ citaSeleccionada.clinicaNombre || '—' }}</p>
              </div>
            </div>
            <div class="odo-detail-item">
              <i class="pi pi-tag" style="color:#3b82f6;margin-top:2px"></i>
              <div>
                <p style="font-size:11px;color:#94a3b8;margin:0">Estado</p>
                <span :class="['odo-badge', estadoCitaClass(citaSeleccionada.estado)]">
                  {{ citaSeleccionada.estado }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="citaSeleccionada.notas" class="odo-notas-box">
            <p style="font-size:11px;font-weight:600;color:#94a3b8;margin:0 0 4px">Notas</p>
            <p style="font-size:13px;color:#374151;margin:0">{{ citaSeleccionada.notas }}</p>
          </div>
        </div>

        <template #footer>
          <Button label="Cerrar" text @click="dialogCita = false" />
          <Button v-if="citaSeleccionada?.estado === 'CONFIRMADA'" label="Marcar completada" icon="pi pi-check"
            style="background:#16529e;border:none" @click="marcarCompletada" />
        </template>
      </Dialog>

    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Select from 'primevue/select'
import Dialog from 'primevue/dialog'
import ProgressSpinner from 'primevue/progressspinner'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useAuthStore } from '@/stores/authStore'
import { useOdontologoStore } from '@/stores/odontologoStore'
import { useCitasStore } from '@/stores/citasStore'
import { LanzarToast } from '@/utils/toastService'

const router = useRouter()
const authStore = useAuthStore()
const odontologoStore = useOdontologoStore()
const citasStore = useCitasStore()

const loading = ref(true)
const dialogCita = ref(false)
const citaSeleccionada = ref<any>(null)
const filtroEstado = ref<string | null>(null)

const estadoOpciones = [
  { label: 'Todos', value: null },
  { label: 'Confirmada', value: 'CONFIRMADA' },
  { label: 'Completada', value: 'COMPLETADA' },
  { label: 'Cancelada', value: 'CANCELADA' },
]

const ESTADO_COLORS: Record<string, string> = {
  CONFIRMADA: '#3b82f6',
  COMPLETADA: '#10b981',
  CANCELADA: '#ef4444',
  PENDIENTE: '#f59e0b',
}

const citasFiltradas = computed(() =>
  filtroEstado.value
    ? citasStore.misCitas.filter(c => c.estado === filtroEstado.value)
    : citasStore.misCitas
)

const calendarEvents = computed(() =>
  citasFiltradas.value.map(c => ({
    id: String(c.id),
    title: c.pacienteNombre || 'Paciente',
    start: `${c.fecha}T${c.hora}`,
    backgroundColor: ESTADO_COLORS[c.estado] || '#64748b',
    borderColor: 'transparent',
    extendedProps: c,
  }))
)

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'timeGridWeek',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay',
  },
  locale: 'es',
  slotMinTime: '07:00:00',
  slotMaxTime: '20:00:00',
  events: calendarEvents.value,
  eventClick: (info: any) => {
    citaSeleccionada.value = info.event.extendedProps
    dialogCita.value = true
  },
  eventContent: (arg: any) => ({
    html: `<div class="odo-fc-event"><b>${arg.event.extendedProps.hora}</b> ${arg.event.title}</div>`,
  }),
}))

const estadoCitaClass = (estado: string) =>
  ({ CONFIRMADA: 'odo-badge-confirmada', COMPLETADA: 'odo-badge-completada', CANCELADA: 'odo-badge-cancelada' }[estado] || 'odo-badge-default')

const formatFecha = (fecha: string) =>
  fecha ? new Date(fecha + 'T00:00').toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''

const marcarCompletada = async () => {
  if (!citaSeleccionada.value) return
  try {
    await citasStore.cambiarEstado(citaSeleccionada.value.id, 'COMPLETADA')
    citaSeleccionada.value.estado = 'COMPLETADA'
    dialogCita.value = false
    LanzarToast('Cita marcada como completada', 'success')
  } catch {
    LanzarToast('Error al actualizar estado', 'error')
  }
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
  } catch {
    LanzarToast('Error al cargar agenda', 'error')
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

.odo-calendar-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .06);
  padding: 1.25rem;
  overflow: hidden;
  flex: 1;
}

/* ── FullCalendar overrides ──────────────────────── */
:deep(.fc-button-primary) {
  background-color: #16529e !important;
  border-color: #16529e !important;
}

:deep(.fc-button-group .fc-button) {
  background: #f1f5f9 !important;
  color: #475569 !important;
  border: 1px solid #e2e8f0 !important;
  text-transform: capitalize;
}

:deep(.fc-button-group .fc-button-active) {
  background: #16529e !important;
  color: white !important;
  border-color: #16529e !important;
}

:deep(.fc-toolbar-title) {
  color: #1e293b;
  font-size: 1.25rem !important;
  font-weight: 700;
}

:deep(.fc-col-header-cell-cushion),
:deep(.fc-timegrid-slot-label-cushion) {
  color: #16529e;
  font-weight: 600;
  text-transform: capitalize;
}

:deep(.fc-day-today) {
  background: #eff6ff !important;
}

:deep(.fc td),
:deep(.fc th) {
  border-color: #f1f5f9 !important;
}

:deep(.fc-event) {
  border-radius: 6px !important;
  padding: 2px 4px;
  border: none !important;
}

:deep(.odo-fc-event) {
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
}

/* ── Dialog ──────────────────────────────────────── */
.odo-dialog-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.odo-dialog-patient {
  display: flex;
  align-items: center;
  gap: 12px;
}

.odo-avatar-icon {
  width: 48px;
  height: 48px;
  background: #16529e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.odo-detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.odo-detail-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.odo-notas-box {
  background: #f8fafc;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #e2e8f0;
}

.odo-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
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
