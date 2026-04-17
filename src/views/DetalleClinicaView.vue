<template>
  <div class="min-h-screen bg-gray-50">
    <!-- NAVBAR -->
    <div class="bg-white border-b sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
        <Button
          icon="pi pi-arrow-left"
          text
          @click="irAtras"
          class="p-button-rounded text-gray-600"
        />
        <h1 class="text-xl font-bold text-gray-900">Detalle de clínica</h1>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center h-96">
      <ProgressSpinner />
    </div>

    <div v-else-if="error" class="max-w-7xl mx-auto px-4 py-8">
      <Message severity="error" :text="error" />
    </div>

    <div v-else-if="clinica" class="max-w-7xl mx-auto px-4 py-8">
      <!-- HEADER CON IMAGEN -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div class="h-64 bg-gradient-to-r" :style="{backgroundImage: 'linear-gradient(135deg, var(--primary-500) 0%, var(--primary-300) 100%)'}"></div>

        <div class="px-6 py-6">
          <h1 class="text-3xl font-bold text-gray-900">{{ clinica.nombre }}</h1>

          <div class="flex items-center gap-4 mt-3">
            <div class="flex items-center gap-2">
              <i class="pi pi-star-fill text-yellow-500"></i>
              <span class="font-bold text-lg">{{ clinica.rating || '4.8' }}</span>
              <span class="text-gray-500">({{ clinica.totalResenas || '142' }} reseñas)</span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div class="flex items-start gap-3">
              <i class="pi pi-map-marker text-2xl" style="color: var(--color-primary)"></i>
              <div>
                <p class="text-sm text-gray-600">Ubicación</p>
                <p class="font-semibold">{{ clinica.direccion }}</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <i class="pi pi-phone text-2xl" style="color: var(--color-primary)"></i>
              <div>
                <p class="text-sm text-gray-600">Teléfono</p>
                <p class="font-semibold">{{ clinica.telefono }}</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <i class="pi pi-globe text-2xl" style="color: var(--color-primary)"></i>
              <div>
                <p class="text-sm text-gray-600">Sitio web</p>
                <p class="font-semibold">{{ clinica.web || 'No disponible' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- DESCRIPCIÓN -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 class="text-xl font-bold text-gray-900 mb-3">Sobre nosotros</h2>
        <p class="text-gray-600 leading-relaxed">{{ clinica.descripcion || 'Clínica dental especializada en servicios de calidad.' }}</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- SERVICIOS -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Servicios disponibles</h2>

            <div v-if="servicios.length > 0" class="space-y-3">
              <div
                v-for="servicio in servicios"
                :key="servicio.id"
                class="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition"
                @click="seleccionarServicio(servicio)"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-bold text-gray-900">{{ servicio.nombre }}</h3>
                    <p class="text-sm text-gray-600 mt-1">
                      <i class="pi pi-clock mr-2"></i>{{ servicio.duracion || 30 }} minutos
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-xl font-bold" style="color: var(--color-primary)">
                      ${{ servicio.precio || '50' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-8 text-gray-500">
              <i class="pi pi-inbox text-4xl block mb-2"></i>
              Sin servicios disponibles
            </div>
          </div>
        </div>

        <!-- PANEL DE AGENDAMIENTO -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Agendar cita</h3>

            <form @submit.prevent="agendar" class="space-y-4">
              <!-- SERVICIO SELECCIONADO -->
              <div>
                <label class="text-sm font-semibold text-gray-700">Servicio *</label>
                <Select
                  v-model="formulario.servicio"
                  :options="servicios"
                  optionLabel="nombre"
                  optionValue="nombre"
                  placeholder="Selecciona un servicio"
                  class="w-full mt-2"
                />
              </div>

              <!-- FECHA -->
              <div>
                <label class="text-sm font-semibold text-gray-700">Fecha *</label>
                <Calendar
                  v-model="formulario.fecha"
                  dateFormat="dd/mm/yy"
                  :minDate="new Date()"
                  class="w-full mt-2"
                />
              </div>

              <!-- HORA -->
              <div>
                <label class="text-sm font-semibold text-gray-700">Hora *</label>
                <Select
                  v-model="formulario.hora"
                  :options="horas"
                  placeholder="Selecciona hora"
                  class="w-full mt-2"
                />
              </div>

              <!-- NOTAS -->
              <div>
                <label class="text-sm font-semibold text-gray-700">Notas adicionales</label>
                <Textarea
                  v-model="formulario.notas"
                  placeholder="Cuéntanos si tienes algún problema específico..."
                  rows="3"
                  class="w-full mt-2"
                />
              </div>

              <!-- ERROR -->
              <Message v-if="errorAgendamiento" severity="error" :text="errorAgendamiento" />

              <!-- BOTÓN -->
              <Button
                label="Agendar cita"
                icon="pi pi-calendar"
                type="submit"
                :loading="cargando"
                class="w-full"
                style="background-color: var(--color-primary); border: none; color: white; font-weight: 600; padding: 0.75rem"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Calendar from 'primevue/calendar'
import Textarea from 'primevue/textarea'
import Message from 'primevue/message'
import ProgressSpinner from 'primevue/progressspinner'
import { obtenerClinica, obtenerServicios } from '@/api/clinicas/clinicasApi'
import { crearCita } from '@/api/citas/citasApi'
import { LanzarToast } from '@/utils/toastService'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const clinica = ref<any>(null)
const servicios = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const cargando = ref(false)
const errorAgendamiento = ref('')

const horas = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00']

const formulario = ref({
  servicio: '',
  fecha: null,
  hora: '',
  notas: ''
})

const cargarDatos = async () => {
  loading.value = true
  const clinicaId = Number(route.params.id)

  try {
    const [clinicaRes, serviciosRes] = await Promise.all([
      obtenerClinica(clinicaId),
      obtenerServicios(clinicaId)
    ])

    clinica.value = clinicaRes.data
    servicios.value = serviciosRes.data || []
  } catch (e: any) {
    error.value = 'Error al cargar los datos'
    LanzarToast(error.value, 'error')
  } finally {
    loading.value = false
  }
}

const seleccionarServicio = (servicio: any) => {
  formulario.value.servicio = servicio.nombre
}

const agendar = async () => {
  errorAgendamiento.value = ''

  if (!formulario.value.servicio || !formulario.value.fecha || !formulario.value.hora) {
    errorAgendamiento.value = 'Por favor completa todos los campos obligatorios'
    LanzarToast(errorAgendamiento.value, 'warn')
    return
  }

  cargando.value = true

  try {
    const servicio = servicios.value.find(s => s.nombre === formulario.value.servicio)

    await crearCita({
      usuarioId: authStore.user?.id,
      clinicaId: Number(route.params.id),
      fecha: formulario.value.fecha.toISOString().split('T')[0],
      hora: formulario.value.hora,
      servicio: formulario.value.servicio,
      duracion: servicio?.duracion || 30,
      notas: formulario.value.notas
    })

    LanzarToast('¡Cita agendada exitosamente!', 'success')
    setTimeout(() => {
      router.push('/mis-citas')
    }, 1500)

  } catch (e: any) {
    errorAgendamiento.value = e.response?.data || 'Error al agendar cita'
    LanzarToast(errorAgendamiento.value, 'error')
  } finally {
    cargando.value = false
  }
}

const irAtras = () => {
  router.back()
}

onMounted(() => {
  cargarDatos()
})
</script>
