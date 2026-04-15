<template>
    <div class="min-h-screen flex items-center justify-center bg-primary-gradient px-4">

        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">

            <!-- LOGO -->
            <div class="flex flex-col items-center mb-6">
                <img src="/logo.png" class="w-50 mb-2" />
                <h2 class="text-2xl font-bold">Iniciar sesión</h2>
                <p class="text-gray-500 text-sm">Accede a tu cuenta</p>
            </div>

            <!-- FORM -->
            <form @submit.prevent="handleLogin" class="space-y-4">

                <div>
                    <label class="text-sm font-medium">Correo electrónico</label>
                    <InputText v-model="form.correo" class="w-full mt-1" />
                </div>

                <div>
                    <label class="text-sm font-medium">Contraseña</label>
                    <Password v-model="form.password" toggleMask :feedback="false" class="w-full mt-1"
                        inputClass="w-full" />
                </div>

                <!-- BOTÓN -->
                <Button @click="handleLogin" label="Iniciar sesión"
                    class="w-full mt-4 bg-(--color-primary)! border-none!" />

            </form>

            <!-- ERROR -->
            <p v-if="error" class="text-red-500 text-sm mt-3 text-center">
                {{ error }}
            </p>

            <!-- REGISTER -->
            <p class="text-center text-sm mt-6">
                ¿No tienes cuenta?
                <router-link to="/registro-paciente" class="text-(--color-primary) font-semibold">
                    Crear cuenta
                </router-link>
            </p>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
    correo: '',
    password: ''
})

const error = ref('')

const handleLogin = async () => {
    error.value = ''

    try {
        const res = await authStore.login(form.value)

        const rol = res.data.rol

        if (rol === 'PACIENTE') router.push('/home')
        else if (rol === 'CLINICA') router.push('/dashboard')
        else if (rol === 'ODONTOLOGO') router.push('/agenda')
        else router.push('/')

    } catch (e: any) {
        error.value = e.response?.data || 'Credenciales incorrectas'
    }
}
</script>