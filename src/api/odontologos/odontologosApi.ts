import { api } from './../apiBase'

// Step 1: Create the Usuarios account via /auth/register
// Expects: { correo, password, tipo: 'ODONTOLOGO' } — returns { id, mensaje }
export async function registrarCuentaOdontologo(datos: { correo: string; password: string; tipo: string }) {
  return await api.post('/auth/register', datos)
}

// Step 2: Create the Odontologo profile linked to the Usuarios id
export async function registrarOdontologo(datos: any) {
  return await api.post('/odontologos/registrar', datos)
}

// Obtener odontólogo por ID
export async function obtenerOdontologo(id: number) {
  return await api.get(`/odontologos/${id}`)
}

// Obtener odontólogo por usuario ID
export async function obtenerOdontologoPorUsuario(usuarioId: number) {
  return await api.get(`/odontologos/usuario/${usuarioId}`)
}

// Obtener todos los odontólogos activos
export async function listarOdontologos() {
  return await api.get('/odontologos')
}

// Obtener odontólogos disponibles (para contratación)
export async function listarOdontologosDisponibles() {
  return await api.get('/odontologos/disponibles')
}

// Buscar odontólogos por ubicación
export async function buscarOdontologosPorUbicacion(ubicacion: string) {
  return await api.get(`/odontologos/buscar/ubicacion/${ubicacion}`)
}

// Buscar odontólogos por especialidad
export async function buscarOdontologosPorEspecialidad(especialidad: string) {
  return await api.get(`/odontologos/buscar/especialidad/${especialidad}`)
}

// Obtener odontólogos de una clínica
export async function obtenerOdontologosClinica(clinicaId: number) {
  return await api.get(`/odontologos/clinica/${clinicaId}`)
}

// Actualizar perfil de odontólogo
export async function actualizarOdontologo(id: number, datos: any) {
  return await api.put(`/odontologos/${id}`, datos)
}

// Actualizar estado de empleo (DESEMPLEADO, BUSCA_EMPLEO, EMPLEADO)
export async function actualizarEstadoOdontologo(id: number, estado: string) {
  return await api.put(`/odontologos/${id}/estado`, { estado })
}

// Desactivar odontólogo
export async function desactivarOdontologo(id: number) {
  return await api.delete(`/odontologos/${id}`)
}

// Subir documento
export async function subirDocumento(odontologoId: number, archivo: File, tipo: string) {
  const formData = new FormData()
  formData.append('archivo', archivo)
  formData.append('tipo', tipo)

  return await api.post(`/odontologos/${odontologoId}/documentos`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// Obtener documentos de un odontólogo
export async function obtenerDocumentosOdontologo(odontologoId: number) {
  return await api.get(`/odontologos/${odontologoId}/documentos`)
}

// Verificar documento (por clínica)
export async function verificarDocumento(
  odontologoId: number,
  documentoId: number,
  verificado: boolean,
  notas?: string,
) {
  return await api.put(`/odontologos/${odontologoId}/documentos/${documentoId}/verificar`, {
    verificado,
    notas,
  })
}

// Eliminar documento
export async function eliminarDocumento(odontologoId: number, documentoId: number) {
  return await api.delete(`/odontologos/${odontologoId}/documentos/${documentoId}`)
}
