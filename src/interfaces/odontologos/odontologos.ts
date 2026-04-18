export interface OdontologoRequest {
  usuarioId?: number
  nombre?: string
  apellido?: string
  cedula?: string
  especialidades?: string
  descripcion?: string
  telefono?: string
  ubicacion?: string
  estado?: string
}

export interface ActualizarEstadoOdontologoRequest {
  estado: string
}

export interface VerificarDocumentoRequest {
  verificado: boolean
  notas?: string
}
