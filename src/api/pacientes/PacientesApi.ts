import { LanzarToast } from '@/utils/toastService'
import { api } from '../apiBase'

export async function registerPaciente(data: {
  correo: string
  password: string
}): Promise<any | undefined> {
  try {
    const response = await api.post('/auth/register', {
      ...data,
      tipo: 'PACIENTE',
    })

    return response.data
  } catch (error: any) {
    console.log(error)
  }
}

export async function crearPerfilPaciente(data: {
  usuarioId: number
  nombre: string
  apellido: string
  telefono: string
  genero: string
  fechaNacimiento: string
}): Promise<any | undefined> {
  try {
    const response = await api.post('/pacientes/perfil', data)

    return response.data
  } catch (error: any) {
    console.log(error)
    LanzarToast('Error al crear la cuenta', 'error')
  }
}
