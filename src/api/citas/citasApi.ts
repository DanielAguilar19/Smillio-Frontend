import { api } from '../apiBase'

// Crear una nueva cita
export const crearCita = (data: {
  pacienteId: number
  clinicaId: number
  fecha: string
  hora: string
  servicio: string
  duracion: number
  notas?: string
}) => {
  return api.post('/citas', data)
}

// Obtener cita por ID
export const obtenerCita = (id: number) => {
  return api.get(`/citas/${id}`)
}

// Obtener todas las citas de un paciente
export const obtenerCitasPaciente = (pacienteId: number) => {
  return api.get(`/citas/paciente/${pacienteId}`)
}

// Obtener todas las citas de una clínica
export const obtenerCitasClinica = (clinicaId: number) => {
  return api.get(`/citas/clinica/${clinicaId}`)
}

// Actualizar estado de cita
export const actualizarEstadusCita = (id: number, nuevoEstado: string) => {
  return api.put(`/citas/${id}/estado?nuevoEstado=${nuevoEstado}`)
}

// Cancelar cita
export const cancelarCita = (id: number) => {
  return api.delete(`/citas/${id}`)
}
