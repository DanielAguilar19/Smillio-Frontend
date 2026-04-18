import { api } from '../apiBase'

// Crear una nueva cita — acepta usuarioId (Usuarios.id) o pacienteId (Paciente.id)
export const crearCita = (data: {
  usuarioId?: number
  pacienteId?: number
  clinicaId: number
  fecha: string
  hora: string
  servicio?: string
  duracion?: number
  notas?: string
}) => {
  return api.post('/citas', data)
}

// Obtener cita por ID
export const obtenerCita = (id: number) => {
  return api.get(`/citas/${id}`)
}

// Obtener citas por Paciente.id (directo)
export const obtenerCitasPaciente = (pacienteId: number) => {
  return api.get(`/citas/paciente/${pacienteId}`)
}

// Obtener citas por Usuarios.id (el id del usuario logueado)
export const obtenerCitasPorUsuario = (usuarioId: number) => {
  return api.get(`/citas/usuario/${usuarioId}`)
}

// Obtener todas las citas de una clínica
export const obtenerCitasClinica = (clinicaId: number) => {
  return api.get(`/citas/clinica/${clinicaId}`)
}

// Obtener citas de un odontólogo
export const obtenerCitasOdontologo = (odontologoId: number) => {
  return api.get(`/citas/odontologo/${odontologoId}`)
}

// Actualizar estado de cita
export const actualizarEstadusCita = (id: number, nuevoEstado: string) => {
  return api.put(`/citas/${id}/estado?nuevoEstado=${nuevoEstado}`)
}

// Reagendar cita
export const reagendarCita = (id: number, fecha: string, hora: string) => {
  return api.put(`/citas/${id}/reagendar`, { fecha, hora })
}

// Cancelar cita
export const cancelarCita = (id: number) => {
  return api.delete(`/citas/${id}`)
}
