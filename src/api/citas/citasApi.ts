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

// Obtener citas por paciente.id
export const obtenerCitasPaciente = (pacienteId: number) => {
  return api.get(`/citas/paciente/${pacienteId}`)
}

// Obtener citas de un paciente usando usuario.id (el id que guarda el login)
export const obtenerCitasPorUsuario = (usuarioId: number) => {
  return api.get(`/citas/usuario/${usuarioId}`)
}

// Obtener citas de un odontólogo
export const obtenerCitasOdontologo = (odontologoId: number) => {
  return api.get(`/citas/odontologo/${odontologoId}`)
}

// Reagendar cita
export const reagendarCita = (id: number, data: { fecha: string; hora: string }) => {
  return api.put(`/citas/${id}/reagendar`, data)
}

// Delegar cita a otro odontólogo
export const delegarCita = (id: number, nuevoOdontologoId: number) => {
  return api.put(`/citas/${id}/delegar`, { nuevoOdontologoId })
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
