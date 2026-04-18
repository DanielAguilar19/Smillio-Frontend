export interface ResenaRequest {
  pacienteId: number
  clinicaId: number
  rating: number
  texto?: string
}

export interface ResponderResenaRequest {
  respuesta: string
}
