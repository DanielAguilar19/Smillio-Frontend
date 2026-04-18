import { defineStore } from 'pinia'
import { ref } from 'vue'
import { crearCita, obtenerCitasPaciente, obtenerCitasPorUsuario, obtenerCitasOdontologo, cancelarCita, actualizarEstadusCita, reagendarCita, delegarCita } from '@/api/citas/citasApi'

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

  // Carga citas usando el usuario.id (el que devuelve el login)
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

  // Carga citas de un odontólogo por su odontologo.id
  const cargarCitasOdontologo = async (odontologoId: number) => {
    loading.value = true
    try {
      const { data } = await obtenerCitasOdontologo(odontologoId)
      misCitas.value = data || []
    } catch (e: any) {
      misCitas.value = []
    } finally {
      loading.value = false
    }
  }

  const reagendar = async (citaId: number, fecha: string, hora: string) => {
    try {
      const { data } = await reagendarCita(citaId, { fecha, hora })
      const idx = misCitas.value.findIndex(c => c.id === citaId)
      if (idx !== -1) misCitas.value[idx] = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Error al reagendar cita'
      throw e
    }
  }

  const delegar = async (citaId: number, nuevoOdontologoId: number) => {
    try {
      const { data } = await delegarCita(citaId, nuevoOdontologoId)
      const idx = misCitas.value.findIndex(c => c.id === citaId)
      if (idx !== -1) misCitas.value[idx] = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Error al delegar cita'
      throw e
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
    cargarCitasOdontologo,
    cancelar,
    cambiarEstado,
    reagendar,
    delegar,
  }
})
