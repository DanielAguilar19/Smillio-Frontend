<template>
  <div class="odo-page">

    <nav class="odo-sidebar">
      <div class="odo-logo">
        <img src="@/assets/smilio-logo-blue.png" class="w-100" />
      </div>

      <div class="odo-nav">
        <Button label="Home" icon="pi pi-home" text class="odo-btn odo-btn-active" />
        <Button @click="router.push('/o-agenda')" label="Agenda" icon="pi pi-calendar" text class="odo-btn" />
        <Button @click="router.push('/o-pacientes')" label="Pacientes" icon="pi pi-users" text class="odo-btn" />
        <Button @click="router.push('/o-clinicas')" label="Clínicas" icon="pi pi-building" text class="odo-btn" />
      </div>

      <div class="odo-nav-bottom">
        <Button @click="router.push('/o-perfil')" label="Mi Perfil" icon="pi pi-cog" text class="odo-btn" />
        <Button @click="cerrarSesion" label="Salir" icon="pi pi-sign-out" text class="odo-btn odo-btn-danger" />
      </div>
    </nav>

    <main class="odo-content">

      <div v-if="loading" class="odo-loading">
        <ProgressSpinner />
      </div>

      <div v-else-if="errorMessage" class="odo-error">
        <i class="pi pi-exclamation-triangle"></i>
        <p>{{ errorMessage }}</p>
      </div>

      <template v-else>
        <!-- Bienvenida -->
        <div class="odo-welcome">
          <div>
            <h1 class="odo-title">¡Bienvenido{{ odontologo ? ', Dr. ' + odontologo.nombre : '' }}!</h1>
            <p class="odo-subtitle">Aquí puedes ver un resumen de tus próximas citas y actividades.</p>
          </div>
          <span v-if="odontologo" :class="['odo-estado', estadoClass]">{{ odontologo.estado || 'DESEMPLEADO' }}</span>
        </div>

        <!-- Métricas -->
        <div class="odo-metrics">
          <div class="odo-metric">
            <div class="odo-metric-icon" style="background:#dbeafe;color:#1d4ed8"><i class="pi pi-calendar"></i></div>
            <div>
              <div class="odo-metric-val">{{ citasHoy.length }}</div>
              <div class="odo-metric-lbl">Citas hoy</div>
            </div>
          </div>
          <div class="odo-metric">
            <div class="odo-metric-icon" style="background:#dcfce7;color:#15803d"><i class="pi pi-check-circle"></i>
            </div>
            <div>
              <div class="odo-metric-val">{{ citasSemana.length }}</div>
              <div class="odo-metric-lbl">Esta semana</div>
            </div>
          </div>
          <div class="odo-metric">
            <div class="odo-metric-icon" style="background:#ede9fe;color:#7c3aed"><i class="pi pi-star"></i></div>
            <div>
              <div class="odo-metric-val">{{ odontologo?.rating?.toFixed(1) || '—' }}</div>
              <div class="odo-metric-lbl">Rating promedio</div>
            </div>
          </div>
          <div class="odo-metric">
            <div class="odo-metric-icon" style="background:#fef3c7;color:#b45309"><i class="pi pi-users"></i></div>
            <div>
              <div class="odo-metric-val">{{ odontologo?.totalResenas || 0 }}</div>
              <div class="odo-metric-lbl">Reseñas totales</div>
            </div>
          </div>
        </div>

        <!-- Próximas citas -->
        <section class="odo-card">
          <div class="odo-card-header">
            <h2 class="odo-section-title">Próximas citas</h2>
            <Button label="Ver agenda completa" text size="small" style="color:white"
              @click="router.push('/o-agenda')" />
          </div>

          <div v-if="citasProximas.length === 0" class="odo-empty">
            <i class="pi pi-calendar-times" style="font-size:2.5rem;color:#94a3b8"></i>
            <p>No tienes citas próximas</p>
          </div>

          <div v-else class="odo-citas-list">
            <div v-for="cita in citasProximas.slice(0, 5)" :key="cita.id" class="odo-cita-row">
              <div class="odo-cita-fecha">
                <span v-if="cita.fecha" class="odo-cita-dia">{{ diaSemana(cita.fecha) ?? 'Día no disponible' }}</span>
                <span v-if="cita.fecha" class="odo-cita-num">{{ formatFecha(cita.fecha) ?? 'Fecha no disponible'
                  }}</span>
                <span class="odo-cita-hora">{{ cita.hora }}</span>
              </div>
              <div class="odo-cita-info">
                <p style="font-weight:600;color:#1e293b;margin:0">{{ cita.pacienteNombre || 'Paciente' }}</p>
                <p style="font-size:13px;color:#64748b;margin:0">{{ cita.servicio || 'Servicio no indicado' }}</p>
                <p v-if="cita.clinicaNombre" style="font-size:11px;color:#94a3b8;margin:0">
                  <i class="pi pi-building" style="margin-right:4px"></i>{{ cita.clinicaNombre }}
                </p>
              </div>
              <span :class="['odo-cita-badge', estadoCitaClass(cita.estado)]">{{ cita.estado || 'PENDIENTE' }}</span>
            </div>
          </div>
        </section>

        <!-- Quick actions -->
        <div class="odo-actions-grid">
          <div class="odo-action-card" @click="router.push('/o-agenda')">
            <i class="pi pi-calendar odo-action-icon"></i>
            <div>
              <p style="font-weight:700;margin:0;font-size:14px;color:#1e293b">Ver mi agenda</p>
              <p style="font-size:12px;color:#94a3b8;margin:0">Revisa todas tus citas en el calendario</p>
            </div>
          </div>
          <div class="odo-action-card" @click="router.push('/o-pacientes')">
            <i class="pi pi-users odo-action-icon"></i>
            <div>
              <p style="font-weight:700;margin:0;font-size:14px;color:#1e293b">Mis pacientes</p>
              <p style="font-size:12px;color:#94a3b8;margin:0">Historial y datos de tus pacientes</p>
            </div>
          </div>
          <div class="odo-action-card" @click="router.push('/o-clinicas')">
            <i class="pi pi-building odo-action-icon"></i>
            <div>
              <p style="font-weight:700;margin:0;font-size:14px;color:#1e293b">Mis clínicas</p>
              <p style="font-size:12px;color:#94a3b8;margin:0">Clínicas donde prestas servicio</p>
            </div>
          </div>
          <div class="odo-action-card" @click="router.push('/o-perfil')">
            <i class="pi pi-cog odo-action-icon"></i>
            <div>
              <p style="font-weight:700;margin:0;font-size:14px;color:#1e293b">Mi perfil</p>
              <p style="font-size:12px;color:#94a3b8;margin:0">Actualiza tu información profesional</p>
            </div>
          </div>
        </div>
      </template>

    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import { useAuthStore } from '@/stores/authStore'
import { useOdontologoStore } from '@/stores/odontologoStore'
import { useCitasStore } from '@/stores/citasStore'

const router = useRouter()
const authStore = useAuthStore()
const odontologoStore = useOdontologoStore()
const citasStore = useCitasStore()

type Cita = {
  id: number | string
  fecha?: string | null;
  hora?: string | null;
  estado?: string
  pacienteNombre?: string
  servicio?: string
  clinicaNombre?: string
}

const loading = ref(true)
const errorMessage = ref('')
const odontologo = computed(() => odontologoStore.miOdontologo)

const toFechaISO = (fecha: Date) => fecha.toISOString().slice(0, 10)
const hoy = toFechaISO(new Date())

const finSemana = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + (6 - d.getDay()))
  return toFechaISO(d)
})

const citas = computed<Cita[]>(() =>
  Array.isArray(citasStore.misCitas) ? citasStore.misCitas : []
)

const citasActivas = computed(() =>
  citas.value.filter(c => c.estado !== 'CANCELADA')
)
const citasHoy = computed(() =>
  citasActivas.value.filter(c => c.fecha === hoy)
)
const citasSemana = computed(() =>
  citasActivas.value.filter(c => c.fecha && c.fecha >= hoy && c.fecha <= finSemana.value)
)
const citasProximas = computed(() =>
  citasActivas.value
    .filter(c => c.fecha && c.fecha >= hoy && c.estado !== 'COMPLETADA')
    .sort((a, b) => `${a.fecha}${a.hora || ''}`.localeCompare(`${b.fecha}${b.hora || ''}`))
)

const estadoClass = computed(() => {
  const e = odontologo.value?.estado
  if (e === 'EMPLEADO') return 'odo-estado-empleado'
  if (e === 'BUSCA_EMPLEO') return 'odo-estado-busca'
  return 'odo-estado-desempleado'
})

const estadoCitaClass = (estado = '') => ({
  'CONFIRMADA': 'odo-badge-confirmada',
  'COMPLETADA': 'odo-badge-completada',
  'CANCELADA': 'odo-badge-cancelada',
}[estado] || 'odo-badge-default')

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const diaSemana = (fecha: string) => DIAS[new Date(fecha + 'T00:00').getDay()]
const formatFecha = (fecha: string) => {
  const d = new Date(fecha + 'T00:00')
  return `${d.getDate()} ${d.toLocaleString('es', { month: 'short' })}`
}

const cerrarSesion = () => {
  authStore.logout()
  router.push('/')
}

onMounted(async () => {
  try {
    if (!authStore.user) {
      authStore.loadUser()
    }

    if (authStore.user?.id) {
      if (!odontologoStore.miOdontologo) {
        await odontologoStore.cargarMiOdontologo(authStore.user.id)
      }

      if (odontologoStore.miOdontologo?.id) {
        await citasStore.cargarCitasOdontologo(odontologoStore.miOdontologo.id)
      }
    } else {
      errorMessage.value = 'No se encontró una sesión activa.'
    }
  } catch (e) {
    console.error('Error cargando datos del odontólogo', e)
    errorMessage.value = 'No se pudo cargar la información del odontólogo.'
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

/* ── Contenido principal ─────────────────────────── */
.odo-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.odo-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.odo-error {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 14px;
}

.odo-error p {
  margin: 0;
}

/* ── Bienvenida ──────────────────────────────────── */
.odo-welcome {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.odo-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #16529e;
  margin: 0;
}

.odo-subtitle {
  font-size: 13px;
  color: #64748b;
  margin: 4px 0 0;
}

.odo-estado {
  padding: 4px 14px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.odo-estado-empleado {
  background: #dcfce7;
  color: #15803d;
}

.odo-estado-busca {
  background: #fef3c7;
  color: #b45309;
}

.odo-estado-desempleado {
  background: #fee2e2;
  color: #b91c1c;
}

/* ── Métricas ────────────────────────────────────── */
.odo-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

@media (max-width: 900px) {
  .odo-metrics {
    grid-template-columns: repeat(2, 1fr);
  }
}

.odo-metric {
  background: white;
  border-radius: 12px;
  padding: 1.1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, .06);
}

.odo-metric-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.odo-metric-val {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.odo-metric-lbl {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 3px;
}

/* ── Card sección ────────────────────────────────── */
.odo-card {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, .06);
}

.odo-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.odo-section-title {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.odo-empty {
  text-align: center;
  padding: 2rem;
  color: #94a3b8;
}

/* ── Lista de citas ──────────────────────────────── */
.odo-citas-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.odo-cita-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #f1f5f9;
  transition: background .15s;
}

.odo-cita-row:hover {
  background: #f8fafc;
}

.odo-cita-fecha {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #eff4ff;
  border-radius: 8px;
  padding: 8px 10px;
  min-width: 60px;
  flex-shrink: 0;
}

.odo-cita-dia {
  font-size: 10px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
}

.odo-cita-num {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.2;
}

.odo-cita-hora {
  font-size: 11px;
  color: #16529e;
  font-weight: 600;
}

.odo-cita-info {
  flex: 1;
  min-width: 0;
}

.odo-cita-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 9999px;
  flex-shrink: 0;
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

/* ── Quick actions ───────────────────────────────── */
.odo-actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (min-width: 1100px) {
  .odo-actions-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.odo-action-card {
  background: white;
  border-radius: 12px;
  padding: 1.1rem 1.25rem;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border-left: 4px solid #16529e;
  cursor: pointer;
  transition: transform .15s, box-shadow .15s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, .06);
}

.odo-action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 82, 158, .12);
}

.odo-action-icon {
  font-size: 1.375rem;
  color: #16529e;
  margin-top: 2px;
  flex-shrink: 0;
}
</style>
