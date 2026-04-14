<template>
    <div class="min-h-screen flex items-center justify-center bg-primary-gradient">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">

            <!-- LOGO -->
            <div class="flex flex-col items-center mb-6">
                <img src="/logo.png" class="w-50 mb-2" />
                <h2 class="text-2xl font-bold">Crear cuenta</h2>
                <p class="text-gray-500 text-sm">Regístrate en Smillio como paciente</p>
            </div>

            <!-- FORM -->
            <form @submit.prevent="registrar" class="space-y-4">

                <div>
                    <label class="text-sm font-medium">Correo electrónico</label>
                    <InputText v-model="form.correo" class="w-full mt-1" />
                </div>

                <div>
                    <label class="text-sm font-medium">Contraseña</label>
                    <Password v-model="form.password" toggleMask :feedback="false" class="w-full mt-1"
                        inputClass="w-full" />
                </div>

                <div>
                    <label class="text-sm font-medium">Confirmar contraseña</label>
                    <Password v-model="form.confirmPassword" toggleMask :feedback="false" class="w-full mt-1"
                        inputClass="w-full" />
                </div>

                <!-- BOTÓN -->
                <Button label="Crear cuenta" class="w-full mt-4 bg-(--color-primary)! border-none!" />

            </form>

            <!-- ERROR -->
            <p v-if="error" class="text-red-500 text-sm mt-3 text-center">
                {{ error }}
            </p>

            <!-- LOGIN -->
            <p class="text-center text-sm mt-6">
                ¿Ya tienes cuenta?
                <router-link to="/login" class="text-(--color-primary) font-semibold">
                    Inicia sesión
                </router-link>
            </p>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import { registerPaciente } from '@/api/pacientes/PacientesApi'

const authStore = useAuthStore()

const form = ref({
    correo: '',
    password: '',
    confirmPassword: ''
})

const error = ref('')

const registrar = async () => {
    error.value = ''

    if (form.value.password !== form.value.confirmPassword) {
        error.value = 'Las contraseñas no coinciden'
        return
    }

    try {
        await registerPaciente({
            correo: form.value.correo,
            password: form.value.password
        })

        alert('Cuenta creada exitosamente')

    } catch (e: any) {
        error.value = e.response?.data || 'Error'
    }
}
</script>