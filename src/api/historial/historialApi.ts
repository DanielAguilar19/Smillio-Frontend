import type { HistorialClinicoRequest } from '@/interfaces/historial/historial'
import { api } from '../apiBase'

export async function crearRegistroHistorial(datos: HistorialClinicoRequest) {
  return await api.post('/historial', datos)
}

export async function obtenerHistorialPaciente(pacienteId: number) {
  return await api.get(`/historial/paciente/${pacienteId}`)
}

export async function obtenerRegistroHistorial(id: number) {
  return await api.get(`/historial/${id}`)
}

export async function actualizarRegistroHistorial(id: number, datos: HistorialClinicoRequest) {
  return await api.put(`/historial/${id}`, datos)
}
