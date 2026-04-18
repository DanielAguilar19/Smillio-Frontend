import { defineStore } from 'pinia'
import { ref } from 'vue'
import { crearCita, obtenerCitasPorUsuario, cancelarCita, actualizarEstadusCita } from '@/api/citas/citasApi'

export const useCitasStore = defineStore('citas', () => {
  const citaSeleccionada = ref<any>(null)
  const misCitas = ref<any[]>([])
  const loading = ref(false)
  const error = ref('')

  const agendar = async (datos: any) => {
    loading.value = true
    error.value = ''
    try {
      const { data } = await crearCita(datos)
      citaSeleccionada.value = data
      return data
    } catch (e: any) {
      error.value = e.response?.data || 'Error al agendar cita'
      throw e
    } finally {
      loading.value = false
    }
  }

  const cargarMisCitas = async (usuarioId: number) => {
    loading.value = true
    try {
      const { data } = await obtenerCitasPorUsuario(usuarioId)
      misCitas.value = data || []
    } catch (e: any) {
      misCitas.value = []
    } finally {
      loading.value = false
    }
  }

  const cancelar = async (citaId: number) => {
    try {
      await cancelarCita(citaId)
      misCitas.value = misCitas.value.filter(c => c.id !== citaId)
    } catch (e: any) {
      error.value = e.message || 'Error al cancelar cita'
      throw e
    }
  }

  const cambiarEstado = async (citaId: number, nuevoEstado: string) => {
    try {
      await actualizarEstadusCita(citaId, nuevoEstado)
      const cita = misCitas.value.find(c => c.id === citaId)
      if (cita) cita.estado = nuevoEstado
    } catch (e: any) {
      error.value = e.message
      throw e
    }
  }

  return {
    citaSeleccionada,
    misCitas,
    loading,
    error,
    agendar,
    cargarMisCitas,
    cancelar,
    cambiarEstado,
  }
})
