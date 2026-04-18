export interface FacturaRequest {
  pacienteId: number
  clinicaId: number
  fecha?: string
  servicio?: string
  monto: number
  estado?: string
  metodoPago?: string
}

export interface PagarFacturaRequest {
  metodoPago: string
}
