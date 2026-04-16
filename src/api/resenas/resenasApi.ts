import { api } from '../apiBase'

export async function crearResena(datos: {
  pacienteId: number
  clinicaId: number
  rating: number
  texto: string
}) {
  return await api.post('/resenas', datos)
}

export async function obtenerResenasClinica(clinicaId: number) {
  return await api.get(`/resenas/clinica/${clinicaId}`)
}

export async function obtenerResenasPendientes(clinicaId: number) {
  return await api.get(`/resenas/clinica/${clinicaId}/pendientes`)
}

export async function responderResena(id: number, datos: { respuesta: string }) {
  return await api.put(`/resenas/${id}/responder`, datos)
}

export async function obtenerEstadisticasResenas(clinicaId: number) {
  return await api.get(`/resenas/clinica/${clinicaId}/estadisticas`)
}
