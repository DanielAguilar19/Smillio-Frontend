import type { LoginRequest } from '@/interfaces/auth/auth'
import { api } from '../apiBase'

export const login = (data: LoginRequest) => {
  return api.post(`/auth/login`, data)
}
