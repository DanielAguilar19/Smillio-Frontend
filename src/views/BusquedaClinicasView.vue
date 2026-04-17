<template>
  <div class="min-h-screen bg-gray-50">
    <!-- HEADER -->
    <div class="bg-white border-b sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <img src="/logo.png" alt="Smillio" class="h-10 w-10 object-contain" />
          <h1 class="text-2xl font-bold" style="color: var(--color-primary)">Smillio</h1>
        </div>
        <Button icon="pi pi-user" text @click="irAPerfil" class="text-gray-600" />
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- TÍTULO -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-900">Busca clínicas dentales</h2>
        <p class="text-gray-600 mt-2">Encuentra especialistas disponibles cerca de ti</p>
      </div>

      <!-- ESPECIALIDADES (categorías) -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Especialidades</h3>
        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          <button
            class="specialty-card"
            :class="{ 'specialty-card-active': especialidadActiva === null }"
            @click="seleccionarEspecialidad(null)"
          >
            <i class="pi pi-th-large specialty-icon"></i>
            <span class="specialty-label">Todas</span>
          </button>
          <button
            v-for="esp in especialidades"
            :key="esp.id"
            class="specialty-card"
            :class="{ 'specialty-card-active': especialidadActiva === esp.nombre }"
            @click="seleccionarEspecialidad(esp.nombre)"
          >
            <i :class="`pi ${esp.icono || 'pi-heart'} specialty-icon`"></i>
            <span class="specialty-label">{{ esp.nombre }}</span>
          </button>
        </div>
      </div>

      <!-- BÚSQUEDA Y FILTROS -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <span class="p-input-icon-left w-full">
            <i class="pi pi-search" style="color: var(--color-primary)"></i>
            <InputText
              v-model="filtros.busqueda"
              placeholder="Buscar clínica..."
              class="w-full"
            />
          </span>
          <span class="p-input-icon-left w-full">
            <i class="pi pi-map-marker" style="color: var(--color-primary)"></i>
            <InputText
              v-model="filtros.ubicacion"
              placeholder="Ubicación..."
              class="w-full"
            />
          </span>
        </div>
        <div v-if="especialidadActiva" class="mt-3 flex items-center gap-2">
          <Tag :value="`Especialidad: ${especialidadActiva}`" style="background-color: var(--color-primary)" />
          <Button icon="pi pi-times" text size="small" @click="seleccionarEspecialidad(null)"
            style="color: var(--color-primary)" />
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
          <div class="h-40 bg-gradient-to-r"
            :style="{backgroundImage: 'linear-gradient(135deg, var(--primary-400) 0%, var(--primary-300) 100%)'}">
          </div>

          <!-- CONTENIDO -->
          <div class="p-4">
            <h3 class="font-bold text-lg text-gray-900">{{ clinica.nombre }}</h3>

            <div class="flex items-center gap-2 mt-2">
              <i class="pi pi-star-fill text-yellow-500"></i>
              <span class="font-semibold">{{ clinica.rating || '4.5' }}</span>
              <span class="text-gray-500 text-sm">({{ clinica.totalResenas || '0' }} reseñas)</span>
            </div>

            <p class="text-gray-600 text-sm mt-3">
              <i class="pi pi-map-marker mr-2"></i>{{ clinica.direccion || 'Tegucigalpa' }}
            </p>

            <p v-if="clinica.telefono" class="text-gray-600 text-sm mt-2">
              <i class="pi pi-phone mr-2"></i>{{ clinica.telefono }}
            </p>

            <!-- SERVICIOS -->
            <div v-if="clinica.servicios?.length" class="mt-4 pt-4 border-t">
              <p class="text-xs font-semibold text-gray-500 mb-2">SERVICIOS</p>
              <div class="flex flex-wrap gap-1">
                <Tag
                  v-for="(servicio, idx) in clinica.servicios.slice(0, 3)"
                  :key="idx"
                  :value="servicio.nombre"
                  style="background-color: var(--primary-50); color: var(--color-primary)"
                  class="text-xs"
                />
                <Tag
                  v-if="clinica.servicios.length > 3"
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
              class="w-full mt-4"
              style="background-color: var(--color-primary); border: none; color: white; font-weight: 600"
            />
          </div>
        </div>
      </div>

      <!-- SIN RESULTADOS -->
      <div v-if="!loading && clinicasFiltradas.length === 0 && !error" class="text-center py-12">
        <i class="pi pi-inbox text-6xl text-gray-300 block mb-4"></i>
        <p class="text-gray-500 text-lg">No encontramos clínicas que coincidan</p>
        <Button label="Ver todas las clínicas" text @click="seleccionarEspecialidad(null)"
          style="color: var(--color-primary); margin-top: 1rem" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import ProgressSpinner from 'primevue/progressspinner'
import { listarClinicas, buscarClinicasPorEspecialidad } from '@/api/clinicas/clinicasApi'
import { listarEspecialidades } from '@/api/especialidades/especialidadesApi'
import { LanzarToast } from '@/utils/toastService'

const router = useRouter()

const clinicas = ref<any[]>([])
const especialidades = ref<any[]>([])
const especialidadActiva = ref<string | null>(null)
const loading = ref(false)
const error = ref('')

const filtros = ref({
  busqueda: '',
  ubicacion: ''
})

const clinicasFiltradas = computed(() => {
  return clinicas.value.filter(c => {
    const matchBusqueda = !filtros.value.busqueda ||
      c.nombre?.toLowerCase().includes(filtros.value.busqueda.toLowerCase())
    const matchUbicacion = !filtros.value.ubicacion ||
      c.direccion?.toLowerCase().includes(filtros.value.ubicacion.toLowerCase())
    return matchBusqueda && matchUbicacion
  })
})

const cargarEspecialidades = async () => {
  try {
    const { data } = await listarEspecialidades()
    especialidades.value = data
  } catch {
    // Non-critical — specialty categories are optional
  }
}

const cargarClinicas = async () => {
  loading.value = true
  error.value = ''
  try {
    const { data } = await listarClinicas()
    clinicas.value = data
  } catch {
    error.value = 'Error al cargar clínicas'
    LanzarToast(error.value, 'error')
  } finally {
    loading.value = false
  }
}

const seleccionarEspecialidad = async (nombre: string | null) => {
  especialidadActiva.value = nombre
  filtros.value.busqueda = ''
  filtros.value.ubicacion = ''

  if (!nombre) {
    await cargarClinicas()
    return
  }

  loading.value = true
  error.value = ''
  try {
    const { data } = await buscarClinicasPorEspecialidad(nombre)
    clinicas.value = data
  } catch {
    error.value = 'Error al filtrar clínicas'
    LanzarToast(error.value, 'error')
  } finally {
    loading.value = false
  }
}

const irADetalle = (clinicaId: number) => {
  router.push(`/clinica/${clinicaId}`)
}

const irAPerfil = () => {
  router.push('/perfil-paciente')
}

onMounted(() => {
  cargarEspecialidades()
  cargarClinicas()
})
</script>

<style scoped>
.specialty-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 0.5rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.specialty-card:hover {
  border-color: var(--color-primary);
  background-color: #f0f4ff;
}

.specialty-card-active {
  border-color: var(--color-primary) !important;
  background-color: #f0f4ff !important;
}

.specialty-icon {
  font-size: 1.5rem;
  color: var(--color-primary);
}

.specialty-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  text-align: center;
  line-height: 1.2;
}
</style>
