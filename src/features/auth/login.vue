<template>
  <div class="min-h-screen flex items-center justify-center bg-primary-gradient px-4">

    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">

      <!-- LOGO -->
      <div class="flex flex-col items-center mb-6">
        <img src="/logo.png" class="w-24 mb-3" />
        <h2 class="text-2xl font-bold text-gray-800">Iniciar sesión</h2>
        <p class="text-gray-500 text-sm mt-1">Accede a tu cuenta Smillio</p>
      </div>

      <!-- FORM -->
      <form @submit.prevent="handleLogin" class="space-y-4">

        <div>
          <label class="text-sm font-medium text-gray-700">Correo electrónico</label>
          <InputText
            v-model="form.correo"
            type="email"
            placeholder="correo@ejemplo.com"
            class="w-full mt-1"
            :disabled="loading"
          />
        </div>

        <div>
          <label class="text-sm font-medium text-gray-700">Contraseña</label>
          <Password
            v-model="form.password"
            toggleMask
            :feedback="false"
            placeholder="••••••••"
            class="w-full mt-1"
            inputClass="w-full"
            :disabled="loading"
          />
        </div>

        <!-- ERROR -->
        <div v-if="error" class="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <i class="pi pi-exclamation-circle text-red-500"></i>
          <span class="text-red-600 text-sm">{{ error }}</span>
        </div>

        <!-- BOTÓN -->
        <Button
          type="submit"
          :label="loading ? 'Ingresando...' : 'Iniciar sesión'"
          :icon="loading ? 'pi pi-spin pi-spinner' : 'pi pi-sign-in'"
          :disabled="loading || !form.correo || !form.password"
          class="w-full mt-2"
          style="background-color: var(--color-primary); border: none; padding: 0.75rem;"
        />
      </form>

      <!-- DIVIDER -->
      <div class="flex items-center gap-3 my-5">
        <div class="flex-1 h-px bg-gray-200"></div>
        <span class="text-xs text-gray-400">¿No tienes cuenta?</span>
        <div class="flex-1 h-px bg-gray-200"></div>
      </div>

      <!-- REGISTRO -->
      <div class="flex flex-col gap-2">
        <router-link
          to="/registro-paciente"
          class="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all"
          style="border-color: var(--color-primary); color: var(--color-primary)"
        >
          <i class="pi pi-user"></i> Registrarme como paciente
        </router-link>
        <router-link
          to="/registro-odontologo"
          class="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
        >
          <i class="pi pi-verified"></i> Soy odontólogo
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { getHomeParaRol } from '@/router'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'

const router = useRouter()
const route  = useRoute()
const authStore = useAuthStore()

const form = ref({ correo: '', password: '' })
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    const res = await authStore.login(form.value)
    const rol: string = res.data.rol

    // Si venía de una ruta protegida, volver a ella (si el rol la permite)
    const redirectTo = route.query.redirect as string | undefined
    if (redirectTo) {
      return router.push(redirectTo)
    }

    // Redirigir según rol
    router.push(getHomeParaRol(rol))

  } catch (e: any) {
    error.value = e.response?.data?.message || e.response?.data || 'Correo o contraseña incorrectos'
  } finally {
    loading.value = false
  }
}
</script>
