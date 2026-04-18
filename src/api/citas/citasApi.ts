import type {
  CitaRequest,
  DelegarCitaRequest,
  ReagendarCitaRequest,
} from '@/interfaces/citas/citas'
import { api } from '../apiBase'

// Crear una nueva cita
export const crearCita = (data: CitaRequest) => {
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
export const reagendarCita = (id: number, data: ReagendarCitaRequest) => {
  return api.put(`/citas/${id}/reagendar`, data)
}

// Delegar cita a otro odontólogo
export const delegarCita = (id: number, nuevoOdontologoId: number) => {
  const data: DelegarCitaRequest = { nuevoOdontologoId }
  return api.put(`/citas/${id}/delegar`, data)
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
