<template>
    <div class="min-h-screen flex items-center justify-center bg-primary-gradient px-4 py-10">
        <div class="form-card">

            <!-- LOGO -->
            <div class="flex flex-col items-center mb-6">
                <img src="/logo.png" class="w-40 h-40 object-contain" alt="Logo de Salud Fácil">
            </div>

            <!-- PROGRESS -->
            <div class="progress-wrap">
                <div class="progress-track">
                    <div class="progress-fill" :style="{ width: paso === 1 ? '50%' : '100%' }"></div>
                </div>
                <div class="progress-steps">
                    <div class="progress-step" :class="{ active: paso >= 1, done: paso > 1 }">
                        <div class="step-circle">{{ paso > 1 ? '✓' : '1' }}</div>
                        <span class="step-text">Tu cuenta</span>
                    </div>
                    <div class="progress-step" :class="{ active: paso >= 2 }">
                        <div class="step-circle">2</div>
                        <span class="step-text">Tu perfil</span>
                    </div>
                </div>
            </div>

            <!-- ── PASO 1: CREAR CUENTA ── -->
            <transition name="slide" mode="out-in">
                <div v-if="paso === 1" key="paso1">
                    <h2 class="form-title">Crea tu cuenta</h2>
                    <p class="form-subtitle">Ingresa tu correo y una contraseña segura</p>

                    <form @submit.prevent="siguientePaso" class="space-y-4 mt-5">

                        <div class="field">
                            <label class="field-label">Correo electrónico</label>
                            <InputText v-model="cuenta.correo" type="email" placeholder="correo@ejemplo.com"
                                class="w-full mt-1" required />
                        </div>

                        <div class="field">
                            <label class="field-label">Contraseña</label>
                            <Password v-model="cuenta.password" toggleMask :feedback="false"
                                placeholder="Mínimo 8 caracteres" class="w-full mt-1" inputClass="w-full" required />
                        </div>

                        <div class="field">
                            <label class="field-label">Confirmar contraseña</label>
                            <Password v-model="cuenta.confirmPassword" toggleMask :feedback="false"
                                placeholder="Repite tu contraseña" class="w-full mt-1" inputClass="w-full" required />
                        </div>

                        <div v-if="error" class="error-box">
                            <i class="pi pi-exclamation-circle"></i> {{ error }}
                        </div>

                        <Button label="Continuar" type="submit" icon="pi pi-arrow-right" iconPos="right"
                            :loading="loading" class="w-full btn-submit" />

                    </form>
                </div>
            </transition>

            <!-- ── PASO 2: DATOS DEL PACIENTE ── -->
            <transition name="slide" mode="out-in">
                <div v-if="paso === 2" key="paso2">
                    <h2 class="form-title">Tu perfil de paciente</h2>
                    <p class="form-subtitle">Completa tus datos para agendar citas</p>

                    <form @submit.prevent="completarRegistro" class="space-y-4 mt-5">

                        <div class="grid grid-cols-2 gap-3">
                            <div class="field">
                                <label class="field-label">Nombre</label>
                                <InputText v-model="perfil.nombre" placeholder="Juan" class="w-full mt-1" required />
                            </div>
                            <div class="field">
                                <label class="field-label">Apellido</label>
                                <InputText v-model="perfil.apellido" placeholder="Pérez" class="w-full mt-1" required />
                            </div>
                        </div>

                        <div class="field">
                            <label class="field-label">Teléfono</label>
                            <InputText v-model="perfil.telefono" type="tel" placeholder="+503 7000-0000"
                                class="w-full mt-1" />
                        </div>

                        <div class="field">
                            <label class="field-label">Género</label>
                            <Select v-model="perfil.genero" :options="generos" placeholder="Selecciona..."
                                class="w-full mt-1" />
                        </div>

                        <div class="field">
                            <label class="field-label">Fecha de nacimiento</label>
                            <InputText v-model="perfil.fechaNacimiento" type="date" class="w-full mt-1" />
                        </div>

                        <div v-if="error" class="error-box">
                            <i class="pi pi-exclamation-circle"></i> {{ error }}
                        </div>

                        <div v-if="success" class="success-box">
                            <i class="pi pi-check-circle"></i> ¡Registro completado! Redirigiendo al inicio de sesión...
                        </div>

                        <div class="flex gap-3">
                            <Button label="Atrás" icon="pi pi-arrow-left" outlined type="button" class="btn-back"
                                @click="paso = 1" :disabled="loading" />
                            <Button label="Finalizar registro" type="submit" icon="pi pi-check" iconPos="right"
                                :loading="loading" class="btn-submit flex-1" />
                        </div>

                    </form>
                </div>
            </transition>

            <!-- LOGIN LINK -->
            <div class="divider-row">
                <span class="divider-line"></span>
                <span class="divider-text">¿Ya tienes cuenta?</span>
                <span class="divider-line"></span>
            </div>
            <router-link to="/login" class="btn-login-link">Iniciar sesión</router-link>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Select from 'primevue/select'
import { registerPaciente, crearPerfilPaciente } from '@/api/pacientes/PacientesApi'

const router = useRouter()

const paso = ref(1)
const error = ref('')
const loading = ref(false)
const success = ref(false)
const usuarioId = ref<number | null>(null)

const generos = ['Masculino', 'Femenino', 'Otro', 'Prefiero no decir']

const cuenta = ref({
    correo: '',
    password: '',
    confirmPassword: '',
})

const perfil = ref({
    nombre: '',
    apellido: '',
    telefono: '',
    genero: '',
    fechaNacimiento: '',
})

// PASO 1  Crear usuario
const siguientePaso = async () => {
    error.value = ''

    if (cuenta.value.password !== cuenta.value.confirmPassword) {
        error.value = 'Las contraseñas no coinciden'
        return
    }

    if (cuenta.value.password.length < 8) {
        error.value = 'La contraseña debe tener al menos 8 caracteres'
        return
    }

    loading.value = true

    try {
        const res = await registerPaciente({
            correo: cuenta.value.correo,
            password: cuenta.value.password,
        })

        usuarioId.value = res.id
        paso.value = 2

    } catch (e: any) {
        error.value = e.response?.data || 'Error al crear la cuenta'
    } finally {
        loading.value = false
    }
}

// PASO 2  Crear perfil de paciente
const completarRegistro = async () => {
    error.value = ''

    if (!perfil.value.nombre || !perfil.value.apellido) {
        error.value = 'El nombre y apellido son obligatorios'
        return
    }

    loading.value = true

    try {
        await crearPerfilPaciente({
            usuarioId: usuarioId.value!,
            nombre: perfil.value.nombre,
            apellido: perfil.value.apellido,
            telefono: perfil.value.telefono,
            genero: perfil.value.genero,
            fechaNacimiento: perfil.value.fechaNacimiento,
        })

        success.value = true
        setTimeout(() => router.push('/login'), 2000)

    } catch (e: any) {
        error.value = e.response?.data || 'Error al guardar el perfil'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.form-card {
    background-color: white;
    border-radius: 1.75rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    width: 100%;
    max-width: 28rem;
    padding: 2.25rem 2rem;
}

.brand-badge {
    width: 4rem;
    height: 4rem;
    background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    border-radius: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
}

.brand-name {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--color-primary);
    letter-spacing: -0.5px;
    margin-top: 0.5rem;
}

/* PROGRESS */
.progress-wrap {
    margin-bottom: 1.75rem;
}

.progress-track {
    height: 5px;
    background-color: var(--primary-100);
    border-radius: 9999px;
    overflow: hidden;
    margin-bottom: 0.875rem;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(to right, var(--primary-500), var(--primary-300));
    border-radius: 9999px;
    transition: width 0.5s ease;
}

.progress-steps {
    display: flex;
    justify-content: space-between;
}

.progress-step {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    opacity: 0.4;
    transition: opacity 0.3s;
}

.progress-step.active {
    opacity: 1;
}

.step-circle {
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 50%;
    background-color: var(--primary-100);
    color: var(--color-primary);
    font-size: 0.75rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s, color 0.3s;
}

.progress-step.active .step-circle {
    background-color: var(--color-primary);
    color: white;
}

.step-text {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-primary);
}

/* FORM */
.form-title {
    font-size: 1.25rem;
    font-weight: 800;
    color: #111827;
}

.form-subtitle {
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 0.25rem;
}

.field-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
}

.error-box {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    border-radius: 0.5rem;
    padding: 0.625rem 0.875rem;
    font-size: 0.875rem;
}

.success-box {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #f0fdf4;
    border: 1px solid #86efac;
    color: #16a34a;
    border-radius: 0.5rem;
    padding: 0.625rem 0.875rem;
    font-size: 0.875rem;
}

.btn-submit {
    background-color: var(--color-primary) !important;
    border: none !important;
    color: white !important;
    font-weight: 600 !important;
    border-radius: 0.75rem !important;
    padding: 0.75rem !important;
    font-size: 1rem !important;
}

.btn-submit:hover {
    opacity: 0.9 !important;
}

.btn-back {
    border: 2px solid var(--primary-200) !important;
    color: var(--color-primary) !important;
    background: transparent !important;
    font-weight: 600 !important;
    border-radius: 0.75rem !important;
    padding: 0.75rem 1rem !important;
}

/* DIVIDER / LOGIN */
.divider-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 1.5rem 0 1rem;
}

.divider-line {
    flex: 1;
    height: 1px;
    background-color: #e5e7eb;
}

.divider-text {
    font-size: 0.8125rem;
    color: #9ca3af;
    white-space: nowrap;
}

.btn-login-link {
    display: block;
    text-align: center;
    width: 100%;
    padding: 0.75rem;
    border: 2px solid var(--color-primary);
    border-radius: 0.75rem;
    color: var(--color-primary);
    font-weight: 600;
    font-size: 0.9375rem;
    text-decoration: none;
    transition: background-color 0.2s;
}

.btn-login-link:hover {
    background-color: var(--primary-50);
}

/* TRANSICIÓN ENTRE PASOS */
.slide-enter-active,
.slide-leave-active {
    transition: all 0.3s ease;
}

.slide-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.slide-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}
</style>
