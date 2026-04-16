<template>
  <div class="min-h-screen bg-gray-50">
    <!-- NAVBAR -->
    <div class="bg-white border-b sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <img src="/logo.png" alt="Smillio" class="h-10 w-10 object-contain" />
          <h1 class="text-xl font-bold" style="color: var(--color-primary)">Mis Citas</h1>
        </div>
        <Button
          label="Buscar clínicas"
          icon="pi pi-plus"
          @click="irABusqueda"
          style="background-color: var(--color-primary); border: none"
        />
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- TABS DE ESTADO -->
      <TabView v-model="tabActiva" class="mb-6">
        <TabPanel header="Próximas" :leftIcon="upcomingCount > 0 ? 'pi pi-check' : ''">
          <div class="space-y-4">
            <div
              v-for="cita in citasProximas"
              :key="cita.id"
              class="bg-white rounded-lg shadow-sm p-6 border-l-4"
              style="border-left-color: var(--color-primary)"
            >
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <!-- FECHA Y HORA -->
                <div>
                  <p class="text-sm text-gray-600">Fecha y hora</p>
                  <p class="text-lg font-bold text-gray-900">{{ formatearFecha(cita.fecha) }}</p>
                  <p class="text-sm font-semibold" style="color: var(--color-primary)">{{ cita.hora }}</p>
                </div>

                <!-- CLÍNICA -->
                <div>
                  <p class="text-sm text-gray-600">Clínica</p>
                  <p class="font-bold text-gray-900">{{ cita.clinica?.nombre || 'Clínica' }}</p>
                  <p class="text-xs text-gray-600 mt-1">
                    <i class="pi pi-map-marker"></i>
                    {{ cita.clinica?.direccion || 'Ubicación' }}
                  </p>
                </div>

                <!-- SERVICIO -->
                <div>
                  <p class="text-sm text-gray-600">Servicio</p>
                  <p class="font-bold text-gray-900">{{ cita.servicio }}</p>
                  <p class="text-xs text-gray-600 mt-1">{{ cita.duracion }} minutos</p>
                </div>

                <!-- ACCIONES -->
                <div class="flex flex-col gap-2">
                  <Button
                    label="Reagendar"
                    icon="pi pi-calendar"
                    outlined
                    size="small"
                    @click="reagendar(cita)"
                  />
                  <Button
                    label="Cancelar"
                    icon="pi pi-trash"
                    severity="danger"
                    text
                    size="small"
                    @click="confirmarCancelacion(cita)"
                  />
                </div>
              </div>
            </div>

            <div v-if="citasProximas.length === 0" class="text-center py-12">
              <i class="pi pi-calendar text-6xl text-gray-300 block mb-4"></i>
              <p class="text-gray-500 text-lg">No tienes citas próximas</p>
              <Button
                label="Agendar ahora"
                @click="irABusqueda"
                style="background-color: var(--color-primary); border: none; margin-top: 1rem"
              />
            </div>
          </div>
        </TabPanel>

        <TabPanel header="Completadas" :leftIcon="completadasCount > 0 ? 'pi pi-check-circle' : ''">
          <div class="space-y-4">
            <div
              v-for="cita in citasCompletadas"
              :key="cita.id"
              class="bg-white rounded-lg shadow-sm p-6 border-l-4"
              style="border-left-color: #10b981"
            >
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p class="text-sm text-gray-600">Fecha</p>
                  <p class="font-bold text-gray-900">{{ formatearFecha(cita.fecha) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Clínica</p>
                  <p class="font-bold text-gray-900">{{ cita.clinica?.nombre }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Servicio</p>
                  <p class="font-bold text-gray-900">{{ cita.servicio }}</p>
                </div>
                <div>
                  <Tag value="Completada" severity="success" />
                </div>
              </div>
            </div>

            <div v-if="citasCompletadas.length === 0" class="text-center py-12 text-gray-500">
              <i class="pi pi-inbox text-6xl text-gray-300 block mb-4"></i>
              Aún no tienes citas completadas
            </div>
          </div>
        </TabPanel>
      </TabView>
    </div>

    <!-- DIALOG DE CONFIRMACIÓN -->
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Tag from 'primevue/tag'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'
import { useCitasStore } from '@/stores/citasStore'
import { useAuthStore } from '@/stores/authStore'
import { LanzarToast } from '@/utils/toastService'

const router = useRouter()
const confirm = useConfirm()
const citasStore = useCitasStore()
const authStore = useAuthStore()

const tabActiva = ref(0)

const citasProximas = computed(() => {
  const hoy = new Date().toISOString().split('T')[0]
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

onMounted(() => {
  cargarCitas()
})
</script>
