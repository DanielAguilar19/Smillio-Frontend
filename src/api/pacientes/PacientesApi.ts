import type { RegistroRequest } from '@/interfaces/auth/auth'
import type { PacienteRequest } from '@/interfaces/pacientes/pacientes'
import { api } from '../apiBase'

export async function registerPaciente(data: {
  correo: string
  password: string
}): Promise<any> {
  const datos: RegistroRequest = {
    ...data,
    tipo: 'PACIENTE',
  }
  const response = await api.post('/auth/register', datos)
  return response.data
}

export async function crearPerfilPaciente(data: PacienteRequest): Promise<any> {
  const response = await api.post('/pacientes/perfil', data)
  return response.data
}

export async function obtenerPaciente(id: number) {
  return await api.get(`/pacientes/${id}`)
}

export async function obtenerPacientePorUsuario(usuarioId: number) {
  return await api.get(`/pacientes/usuario/${usuarioId}`)
}

export async function obtenerPacientesClinica(clinicaId: number) {
  return await api.get(`/pacientes/clinica/${clinicaId}`)
}

export async function actualizarPaciente(id: number, datos: PacienteRequest) {
  return await api.put(`/pacientes/${id}`, datos)
}
