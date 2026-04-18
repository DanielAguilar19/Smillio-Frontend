import type { EspecialidadRequest } from '@/interfaces/especialidades/especialidades'
import { api } from '../apiBase'

// Public: list active specialties (for homepage categories and filters)
export const listarEspecialidades = () => {
  return api.get('/especialidades')
}

// Admin CRUD
export const listarTodasEspecialidades = () => {
  return api.get('/admin/especialidades')
}

export const crearEspecialidad = (data: EspecialidadRequest) => {
  return api.post('/admin/especialidades', data)
}

export const actualizarEspecialidad = (id: number, data: EspecialidadRequest) => {
  return api.put(`/admin/especialidades/${id}`, data)
}

export const eliminarEspecialidad = (id: number) => {
  return api.delete(`/admin/especialidades/${id}`)
}
