<template>
  <div class="min-h-screen bg-gray-50">
    <!-- NAVBAR -->
    <div class="bg-white border-b sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <img src="/logo.png" alt="Smillio" class="h-10 w-10 object-contain" />
          <h1 class="text-xl font-bold" style="color: var(--color-primary)">Mis Citas</h1>
        </div>
        <Button label="Buscar clínicas" icon="pi pi-plus" @click="irABusqueda"
          style="background-color: var(--color-primary); border: none" />
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- TABS DE ESTADO -->
      <div class="citas-tabs-bar">
        <button :class="{ active: tabActiva === 'proximas' }" @click="tabActiva = 'proximas'">
          <i class="pi pi-calendar"></i> Próximas
          <span v-if="upcomingCount > 0" class="tab-badge">{{ upcomingCount }}</span>
        </button>
        <button :class="{ active: tabActiva === 'completadas' }" @click="tabActiva = 'completadas'">
          <i class="pi pi-check-circle"></i> Completadas
          <span v-if="completadasCount > 0" class="tab-badge tab-badge-green">{{ completadasCount }}</span>
        </button>
      </div>

      <!-- PRÓXIMAS -->
      <div v-if="tabActiva === 'proximas'" class="citas-list">
        <div v-for="cita in citasProximas" :key="cita.id" class="cita-card cita-card-proxima">
          <div class="cita-grid">
            <div>
              <p class="cita-label">Fecha y hora</p>
              <p class="cita-value-lg">{{ formatearFecha(cita.fecha) }}</p>
              <p class="cita-hora">{{ cita.hora }}</p>
            </div>
            <div>
              <p class="cita-label">Clínica</p>
              <p class="cita-value">{{ cita.clinicaNombre || 'Clínica' }}</p>
              <p v-if="cita.clinicaDireccion" class="cita-sub">
                <i class="pi pi-map-marker" style="font-size:10px"></i> {{ cita.clinicaDireccion }}
              </p>
            </div>
            <div>
              <p class="cita-label">Servicio</p>
              <p class="cita-value">{{ cita.servicio }}</p>
              <p class="cita-sub">{{ cita.duracion }} min</p>
            </div>
            <div class="cita-actions">
              <Button label="Reagendar" icon="pi pi-calendar" outlined size="small" @click="reagendar(cita)" />
              <Button label="Cancelar" icon="pi pi-trash" severity="danger" text size="small"
                @click="confirmarCancelacion(cita)" />
            </div>
          </div>
        </div>

        <div v-if="citasProximas.length === 0" class="citas-empty">
          <i class="pi pi-calendar"></i>
          <p>No tienes citas próximas</p>
          <Button label="Agendar ahora" @click="irABusqueda"
            style="background-color: var(--color-primary); border: none; margin-top: 1rem" />
        </div>
      </div>

      <!-- COMPLETADAS -->
      <div v-if="tabActiva === 'completadas'" class="citas-list">
        <div v-for="cita in citasCompletadas" :key="cita.id" class="cita-card cita-card-completada">
          <div class="cita-grid">
            <div>
              <p class="cita-label">Fecha</p>
              <p class="cita-value">{{ formatearFecha(cita.fecha) }}</p>
            </div>
            <div>
              <p class="cita-label">Clínica</p>
              <p class="cita-value">{{ cita.clinicaNombre }}</p>
            </div>
            <div>
              <p class="cita-label">Servicio</p>
              <p class="cita-value">{{ cita.servicio }}</p>
            </div>
            <div class="cita-actions">
              <Tag value="Completada" severity="success" />
              <Button v-if="!resenasEnviadas.has(cita.id)" label="Dejar reseña" icon="pi pi-star"
                text size="small" style="color: var(--color-primary)"
                @click="abrirResena(cita)" />
              <span v-else class="resena-enviada">
                <i class="pi pi-check-circle"></i> Reseña enviada
              </span>
            </div>
          </div>
        </div>

        <div v-if="citasCompletadas.length === 0" class="citas-empty">
          <i class="pi pi-inbox"></i>
          <p>Aún no tienes citas completadas</p>
        </div>
      </div>
    </div>

    <!-- DIALOG DE CONFIRMACIÓN -->
    <ConfirmDialog />

    <!-- DIALOG DE RESEÑA -->
    <Dialog v-model:visible="dialogResena" header="¿Cómo fue tu experiencia?" modal :style="{ width: '480px' }" :draggable="false">
      <div class="space-y-5 py-2">
        <p class="text-gray-600 text-sm">
          Comparte tu experiencia en <strong>{{ citaParaResena?.clinicaNombre }}</strong>
        </p>

        <!-- RATING STARS -->
        <div>
          <p class="text-sm font-semibold text-gray-700 mb-2">Calificación *</p>
          <Rating v-model="resenaForm.rating" :cancel="false" />
          <small v-if="resenaError.rating" class="text-red-500">{{ resenaError.rating }}</small>
        </div>

        <!-- COMENTARIO -->
        <div>
          <p class="text-sm font-semibold text-gray-700 mb-2">Comentario (opcional)</p>
          <Textarea v-model="resenaForm.texto" rows="4" class="w-full"
            placeholder="Cuéntanos sobre tu visita, el trato del personal, las instalaciones..." />
          <p class="text-xs text-gray-400 mt-1">{{ resenaForm.texto.length }}/500 caracteres</p>
        </div>
      </div>

      <template #footer>
        <Button label="Cancelar" text @click="dialogResena = false" />
        <Button label="Enviar reseña" icon="pi pi-send"
          style="background-color: var(--color-primary); border: none"
          :loading="enviandoResena" @click="enviarResena" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import ConfirmDialog from 'primevue/confirmdialog'
import Dialog from 'primevue/dialog'
import Rating from 'primevue/rating'
import Textarea from 'primevue/textarea'
import { useConfirm } from 'primevue/useconfirm'
import { useCitasStore } from '@/stores/citasStore'
import { useAuthStore } from '@/stores/authStore'
import { LanzarToast } from '@/utils/toastService'
import { crearResena } from '@/api/resenas/resenasApi'

const router = useRouter()
const confirm = useConfirm()
const citasStore = useCitasStore()
const authStore = useAuthStore()

const tabActiva = ref('proximas')

const citasProximas = computed(() => {
  const hoy = new Date().toISOString().split('T')[0]!
  return citasStore.misCitas.filter(c => c.estado !== 'CANCELADA' && c.estado !== 'COMPLETADA' && c.fecha >= hoy)
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
})

const citasCompletadas = computed(() => {
  return citasStore.misCitas.filter(c => c.estado === 'COMPLETADA')
})

const upcomingCount = computed(() => citasProximas.value.length)
const completadasCount = computed(() => citasCompletadas.value.length)

const formatearFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const cargarCitas = async () => {
  if (authStore.user?.id) {
    try {
      await citasStore.cargarMisCitas(authStore.user.id)
    } catch (e: any) {
      LanzarToast('Error al cargar citas', 'error')
    }
  }
}

const confirmarCancelacion = (cita: any) => {
  confirm.require({
    message: `¿Deseas cancelar la cita del ${formatearFecha(cita.fecha)} a las ${cita.hora}?`,
    header: 'Confirmar cancelación',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => cancelarCita(cita)
  })
}

const cancelarCita = async (cita: any) => {
  try {
    await citasStore.cancelar(cita.id)
    LanzarToast('Cita cancelada', 'success')
  } catch (e: any) {
    LanzarToast('Error al cancelar cita', 'error')
  }
}

const reagendar = (cita: any) => {
  router.push(`/clinica/${cita.clinicaId}`)
  LanzarToast('Selecciona una nueva fecha y hora', 'info')
}

const irABusqueda = () => {
  router.push('/busqueda-clinicas')
}

// ─── Reseña post-cita ──────────────────────────────
const dialogResena = ref(false)
const enviandoResena = ref(false)
const citaParaResena = ref<any>(null)
const resenasEnviadas = ref<Set<number>>(new Set())
const resenaForm = ref({ rating: 0, texto: '' })
const resenaError = ref<Record<string, string>>({})

const abrirResena = (cita: any) => {
  citaParaResena.value = cita
  resenaForm.value = { rating: 0, texto: '' }
  resenaError.value = {}
  dialogResena.value = true
}

const enviarResena = async () => {
  resenaError.value = {}
  if (!resenaForm.value.rating) {
    resenaError.value.rating = 'Selecciona una calificación'
    return
  }
  enviandoResena.value = true
  try {
    await crearResena({
      pacienteId: citaParaResena.value.pacienteId,
      clinicaId: citaParaResena.value.clinicaId,
      rating: resenaForm.value.rating,
      texto: resenaForm.value.texto
    })
    resenasEnviadas.value.add(citaParaResena.value.id)
    dialogResena.value = false
    LanzarToast('¡Gracias por tu reseña!', 'success')
  } catch {
    LanzarToast('Error al enviar la reseña', 'error')
  } finally {
    enviandoResena.value = false
  }
}

onMounted(() => {
  cargarCitas()
})
</script>

<style scoped>
.citas-tabs-bar {
  display: flex;
  gap: 4px;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0;
}
.citas-tabs-bar button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 500;
  background: transparent;
  border: none;
  color: #64748b;
  cursor: pointer;
  position: relative;
  transition: color 0.15s;
}
.citas-tabs-bar button:hover { color: var(--color-primary); }
.citas-tabs-bar button.active {
  color: var(--color-primary);
  font-weight: 600;
}
.citas-tabs-bar button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0; right: 0;
  height: 2px;
  background: var(--color-primary);
  border-radius: 99px;
}

.tab-badge {
  background: var(--color-primary);
  color: white;
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 99px;
}
.tab-badge-green { background: #10b981; }

.citas-list { display: flex; flex-direction: column; gap: 1rem; }

.cita-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07);
  padding: 1.25rem 1.5rem;
  border-left: 4px solid var(--color-primary);
}
.cita-card-completada { border-left-color: #10b981; }

.cita-grid {
  display: grid;
  grid-template-columns: 1.2fr 1.2fr 1fr auto;
  gap: 1rem;
  align-items: start;
}

.cita-label { font-size: 12px; color: #94a3b8; margin-bottom: 2px; }
.cita-value-lg { font-size: 16px; font-weight: 700; color: #1e293b; }
.cita-hora { font-size: 13px; font-weight: 600; color: var(--color-primary); }
.cita-value { font-size: 14px; font-weight: 600; color: #1e293b; }
.cita-sub { font-size: 12px; color: #94a3b8; margin-top: 2px; }
.cita-actions { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }

.resena-enviada { font-size: 12px; color: #10b981; display: flex; align-items: center; gap: 4px; }

.citas-empty {
  text-align: center;
  padding: 3rem;
  color: #94a3b8;
}
.citas-empty i { font-size: 3rem; display: block; margin-bottom: 0.75rem; }
.citas-empty p { font-size: 15px; }

@media (max-width: 768px) {
  .cita-grid {
    grid-template-columns: 1fr;
  }
  .cita-actions { flex-direction: row; flex-wrap: wrap; }
}
</style>
