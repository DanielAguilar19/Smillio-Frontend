import { api } from '../apiBase'

export async function crearFactura(datos: any) {
  return await api.post('/facturas', datos)
}

export async function obtenerFactura(id: number) {
  return await api.get(`/facturas/${id}`)
}

export async function obtenerFacturasClinica(clinicaId: number) {
  return await api.get(`/facturas/clinica/${clinicaId}`)
}

export async function obtenerFacturasPaciente(pacienteId: number) {
  return await api.get(`/facturas/paciente/${pacienteId}`)
}

export async function obtenerFacturasPorEstado(clinicaId: number, estado: string) {
  return await api.get(`/facturas/clinica/${clinicaId}/estado/${estado}`)
}

export async function pagarFactura(id: number, datos: { metodoPago: string }) {
  return await api.put(`/facturas/${id}/pagar`, datos)
}

export async function obtenerEstadisticasFacturas(clinicaId: number) {
  return await api.get(`/facturas/clinica/${clinicaId}/estadisticas`)
}
