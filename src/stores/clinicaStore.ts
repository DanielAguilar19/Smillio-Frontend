import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { obtenerClinica, obtenerServicios } from '@/api/clinicas/clinicasApi'

export const useClinicaStore = defineStore('clinica', () => {
  const clinicaSeleccionada = ref<any>(null)
  const servicios = ref<any[]>([])
  const loading = ref(false)
  const error = ref('')

  const cargarClinica = async (id: number) => {
    loading.value = true
    error.value = ''
    try {
      const { data } = await obtenerClinica(id)
      clinicaSeleccionada.value = data
      await cargarServicios(id)
    } catch (e: any) {
      error.value = e.message || 'Error al cargar clínica'
    } finally {
      loading.value = false
    }
  }

  const cargarServicios = async (clinicaId: number) => {
    try {
      const { data } = await obtenerServicios(clinicaId)
      servicios.value = data || []
    } catch (e: any) {
      servicios.value = []
    }
  }

  const limpiar = () => {
    clinicaSeleccionada.value = null
    servicios.value = []
  }

  return {
    clinicaSeleccionada,
    servicios,
    loading,
    error,
    cargarClinica,
    cargarServicios,
    limpiar,
  }
})
