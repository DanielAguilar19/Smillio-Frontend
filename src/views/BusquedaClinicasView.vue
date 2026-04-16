<template>
  <div class="min-h-screen bg-gray-50">
    <!-- HEADER CON LOGO -->
    <div class="bg-white border-b sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <img src="/logo.png" alt="Smillio" class="h-10 w-10 object-contain" />
          <h1 class="text-2xl font-bold" style="color: var(--color-primary)">Smillio</h1>
        </div>
        <Button
          icon="pi pi-user"
          text
          @click="irAPerfil"
          class="text-gray-600"
        />
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- TÍTULO -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-900">Busca clínicas dentales</h2>
        <p class="text-gray-600 mt-2">Encuentra especialistas disponibles cerca de ti</p>
      </div>

      <!-- BÚSQUEDA Y FILTROS -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <span class="p-input-icon-left w-full">
            <i class="pi pi-search" style="color: var(--color-primary)"></i>
            <InputText
              v-model="filtros.busqueda"
              placeholder="Buscar clínica..."
              class="w-full"
              @input="filtrar"
            />
          </span>

          <span class="p-input-icon-left w-full">
            <i class="pi pi-map-marker" style="color: var(--color-primary)"></i>
            <InputText
              v-model="filtros.ubicacion"
              placeholder="Ubicación..."
              class="w-full"
              @input="filtrar"
            />
          </span>

          <Select
            v-model="filtros.especialidad"
            :options="especialidades"
            placeholder="Especialidad"
            class="w-full"
            @change="filtrar"
          />
        </div>
      </div>

      <!-- LOADING -->
      <div v-if="loading" class="text-center py-12">
        <ProgressSpinner />
      </div>

      <!-- ERROR -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p class="text-red-700">{{ error }}</p>
      </div>

      <!-- LISTADO DE CLÍNICAS -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="clinica in clinicasFiltradas"
          :key="clinica.id"
          class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
          @click="irADetalle(clinica.id)"
        >
          <!-- IMAGEN PLACEHOLDER -->
          <div class="h-40 bg-gradient-to-r" :style="{backgroundImage: 'linear-gradient(135deg, var(--primary-400) 0%, var(--primary-300) 100%)'}"></div>

          <!-- CONTENIDO -->
          <div class="p-4">
            <h3 class="font-bold text-lg text-gray-900">{{ clinica.nombre }}</h3>

            <div class="flex items-center gap-2 mt-2">
              <i class="pi pi-star-fill text-yellow-500"></i>
              <span class="font-semibold">{{ clinica.rating || '4.5' }}</span>
              <span class="text-gray-500 text-sm">({{ clinica.totalResenas || '24' }} reseñas)</span>
            </div>

            <p class="text-gray-600 text-sm mt-3">
              <i class="pi pi-map-marker mr-2"></i>{{ clinica.direccion || 'Tegucigalpa' }}
            </p>

            <p class="text-gray-600 text-sm mt-2">
              <i class="pi pi-phone mr-2"></i>{{ clinica.telefono }}
            </p>

            <!-- SERVICIOS -->
            <div class="mt-4 pt-4 border-t">
              <p class="text-xs font-semibold text-gray-500 mb-2">SERVICIOS</p>
              <div class="flex flex-wrap gap-1">
                <Tag
                  v-for="(servicio, idx) in clinica.servicios?.slice(0, 3)"
                  :key="idx"
                  :value="servicio.nombre"
                  style="background-color: var(--primary-50); color: var(--color-primary)"
                  class="text-xs"
                />
                <Tag
                  v-if="clinica.servicios?.length > 3"
                  :value="`+${clinica.servicios.length - 3}`"
                  severity="info"
                  class="text-xs"
                />
              </div>
            </div>

            <!-- BOTÓN -->
            <Button
              label="Ver detalles"
              icon="pi pi-arrow-right"
              iconPos="right"
              class="w-full mt-4 btn-primary"
              style="background-color: var(--color-primary); border: none; color: white; font-weight: 600"
            />
          </div>
        </div>
      </div>

      <!-- SIN RESULTADOS -->
      <div v-if="!loading && clinicasFiltradas.length === 0" class="text-center py-12">
        <i class="pi pi-inbox text-6xl text-gray-300 block mb-4"></i>
        <p class="text-gray-500 text-lg">No encontramos clínicas que coincidan con tu búsqueda</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import ProgressSpinner from 'primevue/progressspinner'
import { listarClinicas } from '@/api/clinicas/clinicasApi'
import { LanzarToast } from '@/utils/toastService'

const router = useRouter()

const clinicas = ref<any[]>([])
const loading = ref(false)
const error = ref('')

const filtros = ref({
  busqueda: '',
  ubicacion: '',
  especialidad: ''
})

const especialidades = [
  'Limpieza',
  'Ortodoncia',
  'Implantes',
  'Blanqueamiento',
  'Endodoncia',
  'Periodoncia'
]

const clinicasFiltradas = computed(() => {
  return clinicas.value.filter(c => {
    const matchBusqueda = c.nombre?.toLowerCase().includes(filtros.value.busqueda.toLowerCase())
    const matchUbicacion = !filtros.value.ubicacion || c.direccion?.toLowerCase().includes(filtros.value.ubicacion.toLowerCase())
    return matchBusqueda && matchUbicacion
  })
})

const cargarClinicas = async () => {
  loading.value = true
  error.value = ''
  try {
    const { data } = await listarClinicas()
    clinicas.value = data
    LanzarToast('Clínicas cargadas', 'success')
  } catch (e: any) {
    error.value = 'Error al cargar clínicas'
    LanzarToast(error.value, 'error')
  } finally {
    loading.value = false
  }
}

const filtrar = () => {
  // El computed ya se recalcula
}

const irADetalle = (clinicaId: number) => {
  router.push(`/clinica/${clinicaId}`)
}

const irAPerfil = () => {
  router.push('/perfil-paciente')
}

onMounted(() => {
  cargarClinicas()
})
</script>

<style scoped>
.btn-primary:hover {
  opacity: 0.9;
}
</style>
