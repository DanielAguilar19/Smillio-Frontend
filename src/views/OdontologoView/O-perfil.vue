<template>
  <div class="odo-page">

    <nav class="odo-sidebar">
      <div class="odo-logo">
        <img src="@/assets/smilio-logo-blue.png" class="w-100" />
      </div>
      <div class="odo-nav">
        <Button @click="router.push('/o-home')" label="Home" icon="pi pi-home" text class="odo-btn" />
        <Button @click="router.push('/o-agenda')" label="Agenda" icon="pi pi-calendar" text class="odo-btn" />
        <Button @click="router.push('/o-pacientes')" label="Pacientes" icon="pi pi-users" text class="odo-btn" />
        <Button @click="router.push('/o-clinicas')" label="Clínicas" icon="pi pi-building" text class="odo-btn" />
      </div>
      <div class="odo-nav-bottom">
        <Button label="Mi Perfil" icon="pi pi-cog" text class="odo-btn odo-btn-active" />
        <Button @click="cerrarSesion" label="Salir" icon="pi pi-sign-out" text class="odo-btn odo-btn-danger" />
      </div>
    </nav>

    <main class="odo-content">

      <div class="odo-topbar">
        <h1 class="odo-title">Mi perfil profesional</h1>
      </div>

      <div v-if="loading" class="odo-loading">
        <ProgressSpinner />
      </div>

      <div v-else class="odo-profile-layout">

        <!-- Columna izquierda: avatar + resumen -->
        <div class="odo-profile-sidebar">
          <div class="odo-avatar">{{ iniciales }}</div>
          <h2 class="odo-profile-name">Dr. {{ form.nombre }} {{ form.apellido }}</h2>
          <p class="odo-profile-email">{{ authStore.user?.correo }}</p>
          <span :class="['odo-estado', estadoClass]">{{ form.estado || 'DESEMPLEADO' }}</span>

          <div v-if="odontologo?.rating" class="odo-rating">
            <i class="pi pi-star-fill" style="color:#f59e0b"></i>
            <span style="font-weight:700">{{ odontologo.rating.toFixed(1) }}</span>
            <span style="font-size:13px;color:#94a3b8">({{ odontologo.totalResenas || 0 }} reseñas)</span>
          </div>
        </div>

        <!-- Columna derecha: formulario -->
        <div class="odo-profile-form">
          <h3 class="odo-form-title">Información personal</h3>

          <div class="odo-form-grid">
            <div class="odo-field">
              <label>Nombre *</label>
              <InputText v-model="form.nombre" class="w-full" />
            </div>
            <div class="odo-field">
              <label>Apellido</label>
              <InputText v-model="form.apellido" class="w-full" />
            </div>
            <div class="odo-field">
              <label>Cédula profesional</label>
              <InputText v-model="form.cedula" class="w-full" />
            </div>
            <div class="odo-field">
              <label>Teléfono</label>
              <InputText v-model="form.telefono" class="w-full" />
            </div>
            <div class="odo-field">
              <label>Ubicación</label>
              <InputText v-model="form.ubicacion" placeholder="Ciudad, País" class="w-full" />
            </div>
            <div class="odo-field">
              <label>Estado laboral</label>
              <Select v-model="form.estado" :options="estadoOpciones" optionLabel="label" optionValue="value"
                class="w-full" />
            </div>
            <div class="odo-field odo-col2">
              <label>Especialidades</label>
              <InputText v-model="form.especialidades" class="w-full"
                placeholder="Ej: IMPLANTES, ORTODONCIA, ENDODONCIA" />
              <small style="color:#94a3b8">Separadas por comas</small>
            </div>
            <div class="odo-field odo-col2">
              <label>Descripción / Sobre mí</label>
              <Textarea v-model="form.descripcion" rows="4" class="w-full"
                placeholder="Tu experiencia, áreas de especialización..." />
            </div>
          </div>

          <div style="display:flex;justify-content:flex-end;margin-top:1rem">
            <Button label="Guardar cambios" icon="pi pi-save" style="background:#16529e;border:none"
              :loading="guardando" @click="guardarCambios" />
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import ProgressSpinner from 'primevue/progressspinner'
import { useAuthStore } from '@/stores/authStore'
import { useOdontologoStore } from '@/stores/odontologoStore'
import { LanzarToast } from '@/utils/toastService'

const router = useRouter()
const authStore = useAuthStore()
const odontologoStore = useOdontologoStore()

const loading = ref(true)
const guardando = ref(false)

const odontologo = computed(() => odontologoStore.miOdontologo)

const form = ref({
  nombre: '',
  apellido: '',
  cedula: '',
  telefono: '',
  ubicacion: '',
  estado: 'DESEMPLEADO',
  especialidades: '',
  descripcion: '',
})

const estadoOpciones = [
  { label: 'Desempleado', value: 'DESEMPLEADO' },
  { label: 'Buscando empleo', value: 'BUSCA_EMPLEO' },
  { label: 'Empleado', value: 'EMPLEADO' },
]

const iniciales = computed(() => {
  const n = form.value.nombre
  const a = form.value.apellido
  return ((n?.[0] || '') + (a?.[0] || '')).toUpperCase() || 'O'
})

const estadoClass = computed(() => {
  const e = form.value.estado
  if (e === 'EMPLEADO') return 'odo-estado-empleado'
  if (e === 'BUSCA_EMPLEO') return 'odo-estado-busca'
  return 'odo-estado-desempleado'
})

const guardarCambios = async () => {
  if (!odontologo.value?.id) return
  guardando.value = true
  try {
    await odontologoStore.actualizar(odontologo.value.id, { ...form.value })
    LanzarToast('Perfil actualizado correctamente', 'success')
  } catch {
    LanzarToast('Error al guardar los cambios', 'error')
  } finally {
    guardando.value = false
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
      const od = odontologoStore.miOdontologo
      if (od) {
        form.value = {
          nombre: od.nombre || '',
          apellido: od.apellido || '',
          cedula: od.cedula || '',
          telefono: od.telefono || '',
          ubicacion: od.ubicacion || '',
          estado: od.estado || 'DESEMPLEADO',
          especialidades: od.especialidades || '',
          descripcion: od.descripcion || '',
        }
      }
    }
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

/* ── Layout perfil ───────────────────────────────── */
.odo-profile-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 1.5rem;
  align-items: flex-start;
}

@media (max-width: 768px) {
  .odo-profile-layout {
    grid-template-columns: 1fr;
  }
}

/* ── Sidebar perfil ──────────────────────────────── */
.odo-profile-sidebar {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, .06);
  gap: 8px;
}

.odo-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #16529e;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 700;
}

.odo-profile-name {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  text-align: center;
  margin: 0;
}

.odo-profile-email {
  font-size: 13px;
  color: #64748b;
  text-align: center;
  margin: 0;
}

.odo-estado {
  padding: 4px 14px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
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

.odo-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}

/* ── Formulario ──────────────────────────────────── */
.odo-profile-form {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, .06);
}

.odo-form-title {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 1rem;
}

.odo-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.odo-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.odo-field label {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}

.odo-col2 {
  grid-column: span 2;
}
</style>
