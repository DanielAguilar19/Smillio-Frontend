import axios from 'axios'

const API = import.meta.env.VITE_API

export const registerPaciente = (data: { correo: string; password: string }) => {
  return axios.post(`${API}/auth/register`, {
    ...data,
    tipo: 'PACIENTE',
  })
}
