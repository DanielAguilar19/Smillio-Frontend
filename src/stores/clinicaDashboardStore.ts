import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { obtenerClinica, obtenerServicios, actualizarClinica, agregarServicio, eliminarServicio, actualizarHorario } from '@/api/clinicas/clinicasApi'
import { obtenerCitasClinica, actualizarEstadusCita, cancelarCita } from '@/api/citas/citasApi'
import { obtenerFacturasClinica, pagarFactura } from '@/api/facturas/facturasApi'
import { obtenerResenasClinica, responderResena as responderResenaApi } from '@/api/resenas/resenasApi'
import { obtenerPacientesClinica } from '@/api/pacientes/PacientesApi'
import { LanzarToast } from '@/utils/toastService'

export const useClinicaDashboardStore = defineStore('clinicaDashboard', () => {
  // ─── State ────────────────────────────────────────────────────
  const clinicaId = ref<number | null>(null)
  const clinica = ref<any>({
    id: null, nombre: '', rtn: '', telefono: '', email: '',
    direccion: '', web: '', descripcion: '', rating: 0,
    totalResenas: 0, doctorNombre: '', doctorEspecialidad: '',
    servicios: [], horario: []
  })
  const pacientes = ref<any[]>([])
  const citas = ref<any[]>([])
  const facturas = ref<any[]>([])
  const resenas = ref<any[]>([])
  const loading = ref(false)
  const error = ref('')

  // ─── Computed ─────────────────────────────────────────────────
  const getPaciente = (id: number | string) =>
    pacientes.value.find(p => p.id === id || p.id === Number(id))

  const citasHoy = computed(() => {
    const hoy = new Date().toISOString().split('T')[0]
    return citas.value
      .filter(c => c.fecha === hoy && c.estado !== 'CANCELADA')
      .sort((a, b) => a.hora.localeCompare(b.hora))
  })

  const totalMes = computed(() => {
    const mes = new Date().toISOString().slice(0, 7) // "YYYY-MM"
    return facturas.value
      .filter(f => f.estado === 'PAGADA' && f.fecha?.startsWith(mes))
      .reduce((s, f) => s + (f.monto || 0), 0)
  })

  const pendientesCobro = computed(() =>
    facturas.value
      .filter(f => f.estado === 'PENDIENTE' || f.estado === 'VENCIDA')
      .reduce((s, f) => s + (f.monto || 0), 0)
  )

  // ─── Acciones de carga ────────────────────────────────────────
  const cargarClinica = async (id: number) => {
    try {
      const [clinicaRes, serviciosRes] = await Promise.all([
        obtenerClinica(id),
        obtenerServicios(id)
      ])
      clinica.value = {
        ...clinicaRes.data,
        servicios: serviciosRes.data || []
      }
    } catch (e: any) {
      error.value = 'Error al cargar la clínica'
    }
  }

  const cargarCitas = async (id: number) => {
    try {
      const res = await obtenerCitasClinica(id)
      citas.value = (res.data || []).map((c: any) => ({
        ...c,
        pacienteId: c.pacienteId,
        nombrePaciente: c.pacienteNombre,
        estado: c.estado?.toLowerCase()
      }))
    } catch {
      citas.value = []
    }
  }

  const cargarFacturas = async (id: number) => {
    try {
      const res = await obtenerFacturasClinica(id)
      facturas.value = (res.data || []).map((f: any) => ({
        ...f,
        estado: f.estado?.toLowerCase()
      }))
    } catch {
      facturas.value = []
    }
  }

  const cargarResenas = async (id: number) => {
    try {
      const res = await obtenerResenasClinica(id)
      resenas.value = res.data || []
    } catch {
      resenas.value = []
    }
  }

  const cargarPacientes = async (id: number) => {
    try {
      const res = await obtenerPacientesClinica(id)
      pacientes.value = (res.data || []).map((p: any) => ({
        ...p,
        avatarColor: ['blue', 'green', 'amber', 'violet', 'rose', 'teal'][p.id % 6],
        estado: 'activo',
        historial: []
      }))
    } catch {
      pacientes.value = []
    }
  }

  const cargarTodo = async (id: number) => {
    clinicaId.value = id
    loading.value = true
    error.value = ''
    await Promise.all([
      cargarClinica(id),
      cargarCitas(id),
      cargarFacturas(id),
      cargarResenas(id),
      cargarPacientes(id)
    ])
    loading.value = false
  }

  // ─── Acciones de citas ────────────────────────────────────────
  const agregarCita = async (citaData: any) => {
    try {
      const { crearCita } = await import('@/api/citas/citasApi')
      await crearCita(citaData)
      if (clinicaId.value) await cargarCitas(clinicaId.value)
      LanzarToast('Cita agendada correctamente', 'success')
    } catch {
      LanzarToast('Error al agendar la cita', 'error')
    }
  }

  const actualizarCita = async (id: number, datos: any) => {
    try {
      await actualizarEstadusCita(id, (datos.estado || '').toUpperCase())
      if (clinicaId.value) await cargarCitas(clinicaId.value)
    } catch {
      LanzarToast('Error al actualizar la cita', 'error')
    }
  }

  const eliminarCita = async (id: number) => {
    try {
      await cancelarCita(id)
      citas.value = citas.value.filter(c => c.id !== id)
      LanzarToast('Cita cancelada', 'success')
    } catch {
      LanzarToast('Error al cancelar la cita', 'error')
    }
  }

  // ─── Acciones de facturas ─────────────────────────────────────
  const marcarFacturaPagada = async (id: number, metodo: string) => {
    try {
      await pagarFactura(id, { metodoPago: metodo })
      const f = facturas.value.find(f => f.id === id)
      if (f) { f.estado = 'pagada'; f.metodoPago = metodo }
      LanzarToast('Factura marcada como pagada', 'success')
    } catch {
      LanzarToast('Error al registrar el pago', 'error')
    }
  }

  // ─── Acciones de reseñas ──────────────────────────────────────
  const responderResena = async (id: number, texto: string) => {
    try {
      await responderResenaApi(id, { respuesta: texto })
      const r = resenas.value.find(r => r.id === id)
      if (r) { r.respuesta = texto; r.respondida = true }
      LanzarToast('Respuesta publicada', 'success')
    } catch {
      LanzarToast('Error al responder la reseña', 'error')
    }
  }

  // ─── Acciones de clínica ──────────────────────────────────────
  const guardarClinica = async (datos: any) => {
    if (!clinicaId.value) return
    try {
      const res = await actualizarClinica(clinicaId.value, datos)
      clinica.value = { ...clinica.value, ...res.data }
      LanzarToast('Cambios guardados correctamente', 'success')
    } catch {
      LanzarToast('Error al guardar los cambios', 'error')
    }
  }

  const agregarServicioClinica = async (datos: any) => {
    if (!clinicaId.value) return
    try {
      await agregarServicio(clinicaId.value, datos)
      await cargarClinica(clinicaId.value)
      LanzarToast('Servicio agregado', 'success')
    } catch {
      LanzarToast('Error al agregar el servicio', 'error')
    }
  }

  const eliminarServicioClinica = async (servicioId: number) => {
    if (!clinicaId.value) return
    try {
      await eliminarServicio(clinicaId.value, servicioId)
      clinica.value.servicios = clinica.value.servicios.filter((s: any) => s.id !== servicioId)
      LanzarToast('Servicio eliminado', 'success')
    } catch {
      LanzarToast('Error al eliminar el servicio', 'error')
    }
  }

  const guardarHorario = async (horario: any[]) => {
    if (!clinicaId.value) return
    try {
      const res = await actualizarHorario(clinicaId.value, horario)
      clinica.value = { ...clinica.value, ...res.data }
      LanzarToast('Horario actualizado correctamente', 'success')
    } catch {
      LanzarToast('Error al guardar el horario', 'error')
    }
  }

  return {
    clinicaId, clinica, pacientes, citas, facturas, resenas, loading, error,
    getPaciente, citasHoy, totalMes, pendientesCobro,
    cargarTodo, cargarClinica, cargarCitas, cargarFacturas, cargarResenas, cargarPacientes,
    agregarCita, actualizarCita, eliminarCita,
    marcarFacturaPagada,
    responderResena,
    guardarClinica, agregarServicioClinica, eliminarServicioClinica, guardarHorario
  }
})
