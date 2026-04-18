export interface ClinicaRequest {
  usuarioId?: number
  nombre?: string
  rtn?: string
  telefono?: string
  email?: string
  direccion?: string
  web?: string
  descripcion?: string
  doctorNombre?: string
  doctorEspecialidad?: string
}

export interface ServicioRequest {
  nombre: string
  duracion: number
  precio: number
}

export interface HorarioDiaRequest {
  diaSemana?: string
  horaApertura?: string
  horaCierre?: string
  cerrado?: boolean
}
