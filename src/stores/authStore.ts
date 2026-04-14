import { defineStore } from 'pinia'
import { login } from '@/api/auth/loginApi'

interface User {
  id: number
  correo: string
  rol: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
  }),

  actions: {
    async login(form: { correo: string; password: string }) {
      const res = await login(form)

      this.user = res.data
      this.isAuthenticated = true

      localStorage.setItem('user', JSON.stringify(res.data))

      return res
    },

    loadUser() {
      const user = localStorage.getItem('user')

      if (user) {
        this.user = JSON.parse(user)
        this.isAuthenticated = true
      }
    },

    logout() {
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('user')
    },
  },
})
