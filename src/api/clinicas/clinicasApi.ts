import { api } from '../apiBase'

// Listar todas las clínicas
export const listarClinicas = () => {
  return api.get('/clinicas')
}

// Obtener detalle de una clínica
export const obtenerClinica = (id: number) => {
  return api.get(`/clinicas/${id}`)
}

// Obtener servicios de una clínica
export const obtenerServicios = (clinicaId: number) => {
  return api.get(`/clinicas/${clinicaId}/servicios`)
}

// Actualizar clínica
export const actualizarClinica = (id: number, data: any) => {
  return api.put(`/clinicas/${id}`, data)
}

// Agregar servicio a clínica
export const agregarServicio = (clinicaId: number, data: any) => {
  return api.post(`/clinicas/${clinicaId}/servicios`, data)
}

// Actualizar servicio
export const actualizarServicio = (clinicaId: number, servicioId: number, data: any) => {
  return api.put(`/clinicas/${clinicaId}/servicios/${servicioId}`, data)
}

// Eliminar servicio
export const eliminarServicio = (clinicaId: number, servicioId: number) => {
  return api.delete(`/clinicas/${clinicaId}/servicios/${servicioId}`)
}

// Actualizar horario
export const actualizarHorario = (clinicaId: number, horario: any[]) => {
  return api.put(`/clinicas/${clinicaId}/horario`, horario)
}
