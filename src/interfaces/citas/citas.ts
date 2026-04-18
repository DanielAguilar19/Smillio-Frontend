export interface CitaRequest {
  pacienteId?: number
  usuarioId?: number
  clinicaId: number
  odontologoId?: number
  fecha: string
  hora: string
  servicio?: string
  duracion?: number
  estado?: string
  notas?: string
}

export interface ReagendarCitaRequest {
  fecha: string
  hora: string
}

export interface DelegarCitaRequest {
  nuevoOdontologoId: number
}
