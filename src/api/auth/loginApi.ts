import { api } from '../apiBase'

const API = import.meta.env.VITE_API
export const login = (data: { correo: string; password: string }) => {
  return api.post(`/auth/login`, data)
}
