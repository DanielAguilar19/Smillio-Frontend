import { api } from '../apiBase'

// Public: list active specialties (for homepage categories and filters)
export const listarEspecialidades = () => {
  return api.get('/especialidades')
}

// Admin CRUD
export const listarTodasEspecialidades = () => {
  return api.get('/admin/especialidades')
}

export const crearEspecialidad = (data: { nombre: string; descripcion?: string; icono?: string }) => {
  return api.post('/admin/especialidades', data)
}

export const actualizarEspecialidad = (id: number, data: { nombre: string; descripcion?: string; icono?: string }) => {
  return api.put(`/admin/especialidades/${id}`, data)
}

export const eliminarEspecialidad = (id: number) => {
  return api.delete(`/admin/especialidades/${id}`)
}
