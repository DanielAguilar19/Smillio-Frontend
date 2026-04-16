import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/api/apiBase'
import {
  registrarOdontologo,
  obtenerOdontologo,
  obtenerOdontologoPorUsuario,
  listarOdontologos,
  listarOdontologosDisponibles,
  buscarOdontologosPorUbicacion,
  buscarOdontologosPorEspecialidad,
  obtenerOdontologosClinica,
  actualizarOdontologo,
  actualizarEstadoOdontologo,
  subirDocumento,
  obtenerDocumentosOdontologo,
  verificarDocumento,
  eliminarDocumento
} from '@/api/odontologos/odontologosApi'

export const useOdontologoStore = defineStore('odontologo', () => {
  // State
  const odontologoActual = ref<any>(null)
  const miOdontologo = ref<any>(null)
  const listaOdontologos = ref<any[]>([])
  const odontologosDisponibles = ref<any[]>([])
  const documentos = ref<any[]>([])
  const loading = ref(false)
  const error = ref('')

  // Computed
  const tieneOdontologo = computed(() => !!miOdontologo.value)
  const documentosPendientes = computed(() => documentos.value.filter(d => !d.verificado))
  const documentosVerificados = computed(() => documentos.value.filter(d => d.verificado))

  // Acciones

  // Crear cuenta de usuario para el odontólogo (igual que /auth/register de pacientes)
  const registrarUsuario = async (datos: { correo: string; password: string }) => {
    loading.value = true
    error.value = ''
    try {
      const response = await api.post('/auth/register', {
        correo: datos.correo,
        password: datos.password,
        tipo: 'ODONTOLOGO'
      })
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al crear la cuenta'
      throw err
    } finally {
      loading.value = false
    }
  }

  const registrar = async (datosOdontologo: any) => {
    loading.value = true
    error.value = ''
    try {
      const response = await registrarOdontologo(datosOdontologo)
      miOdontologo.value = response.data
      odontologoActual.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al registrar odontólogo'
      throw err
    } finally {
      loading.value = false
    }
  }

  const cargarOdontologo = async (id: number) => {
    loading.value = true
    error.value = ''
    try {
      const response = await obtenerOdontologo(id)
      odontologoActual.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al cargar odontólogo'
      throw err
    } finally {
      loading.value = false
    }
  }

  const cargarMiOdontologo = async (usuarioId: number) => {
    loading.value = true
    error.value = ''
    try {
      const response = await obtenerOdontologoPorUsuario(usuarioId)
      miOdontologo.value = response.data
      odontologoActual.value = response.data
      // Cargar documentos
      await cargarDocumentos(response.data.id)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al cargar mi perfil'
      throw err
    } finally {
      loading.value = false
    }
  }

  const cargarOdontologos = async () => {
    loading.value = true
    error.value = ''
    try {
      const response = await listarOdontologos()
      listaOdontologos.value = response.data || []
      return listaOdontologos.value
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al cargar odontólogos'
      throw err
    } finally {
      loading.value = false
    }
  }

  const cargarDisponibles = async () => {
    loading.value = true
    error.value = ''
    try {
      const response = await listarOdontologosDisponibles()
      odontologosDisponibles.value = response.data || []
      return odontologosDisponibles.value
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al cargar odontólogos disponibles'
      throw err
    } finally {
      loading.value = false
    }
  }

  const buscarPorUbicacion = async (ubicacion: string) => {
    loading.value = true
    error.value = ''
    try {
      const response = await buscarOdontologosPorUbicacion(ubicacion)
      listaOdontologos.value = response.data || []
      return listaOdontologos.value
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error en búsqueda'
      throw err
    } finally {
      loading.value = false
    }
  }

  const buscarPorEspecialidad = async (especialidad: string) => {
    loading.value = true
    error.value = ''
    try {
      const response = await buscarOdontologosPorEspecialidad(especialidad)
      listaOdontologos.value = response.data || []
      return listaOdontologos.value
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error en búsqueda'
      throw err
    } finally {
      loading.value = false
    }
  }

  const cargarOdontologosClinica = async (clinicaId: number) => {
    loading.value = true
    error.value = ''
    try {
      const response = await obtenerOdontologosClinica(clinicaId)
      listaOdontologos.value = response.data || []
      return listaOdontologos.value
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al cargar odontólogos de la clínica'
      throw err
    } finally {
      loading.value = false
    }
  }

  const actualizar = async (id: number, datos: any) => {
    loading.value = true
    error.value = ''
    try {
      const response = await actualizarOdontologo(id, datos)
      miOdontologo.value = response.data
      odontologoActual.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al actualizar perfil'
      throw err
    } finally {
      loading.value = false
    }
  }

  const actualizarEstado = async (id: number, nuevoEstado: string) => {
    loading.value = true
    error.value = ''
    try {
      const response = await actualizarEstadoOdontologo(id, nuevoEstado)
      miOdontologo.value = response.data
      odontologoActual.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al actualizar estado'
      throw err
    } finally {
      loading.value = false
    }
  }

  const cargarDocumentos = async (odontologoId: number) => {
    loading.value = true
    error.value = ''
    try {
      const response = await obtenerDocumentosOdontologo(odontologoId)
      documentos.value = response.data || []
      return documentos.value
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al cargar documentos'
      throw err
    } finally {
      loading.value = false
    }
  }

  const subirDoc = async (odontologoId: number, archivo: File, tipo: string) => {
    loading.value = true
    error.value = ''
    try {
      const response = await subirDocumento(odontologoId, archivo, tipo)
      documentos.value.push(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al subir documento'
      throw err
    } finally {
      loading.value = false
    }
  }

  const verificarDoc = async (odontologoId: number, documentoId: number, verificado: boolean, notas?: string) => {
    loading.value = true
    error.value = ''
    try {
      const response = await verificarDocumento(odontologoId, documentoId, verificado, notas)
      const index = documentos.value.findIndex(d => d.id === documentoId)
      if (index !== -1) {
        documentos.value[index] = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al verificar documento'
      throw err
    } finally {
      loading.value = false
    }
  }

  const eliminarDoc = async (odontologoId: number, documentoId: number) => {
    loading.value = true
    error.value = ''
    try {
      await eliminarDocumento(odontologoId, documentoId)
      documentos.value = documentos.value.filter(d => d.id !== documentoId)
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al eliminar documento'
      throw err
    } finally {
      loading.value = false
    }
  }

  const limpiar = () => {
    odontologoActual.value = null
    miOdontologo.value = null
    listaOdontologos.value = []
    odontologosDisponibles.value = []
    documentos.value = []
    error.value = ''
  }

  return {
    // State
    odontologoActual,
    miOdontologo,
    listaOdontologos,
    odontologosDisponibles,
    documentos,
    loading,
    error,

    // Computed
    tieneOdontologo,
    documentosPendientes,
    documentosVerificados,

    // Actions
    registrarUsuario,
    registrar,
    cargarOdontologo,
    cargarMiOdontologo,
    cargarOdontologos,
    cargarDisponibles,
    buscarPorUbicacion,
    buscarPorEspecialidad,
    cargarOdontologosClinica,
    actualizar,
    actualizarEstado,
    cargarDocumentos,
    subirDoc,
    verificarDoc,
    eliminarDoc,
    limpiar
  }
})
