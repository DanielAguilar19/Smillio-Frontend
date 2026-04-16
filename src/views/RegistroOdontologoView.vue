<template>
  <div class="min-h-screen bg-gray-50">
    <!-- NAVBAR -->
    <div class="bg-white border-b sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
        <Button icon="pi pi-arrow-left" text @click="irAtras" class="p-button-rounded text-gray-600" />
        <img src="/logo.png" alt="Smillio" class="h-8 w-8 object-contain" />
        <h1 class="text-xl font-bold" style="color: var(--color-primary)">Registro de Odontólogo</h1>
      </div>
    </div>

    <div class="max-w-2xl mx-auto px-4 py-8">
      <!-- STEP INDICATOR -->
      <div class="flex items-center justify-center gap-0 mb-10">
        <div v-for="(step, index) in pasos" :key="index" class="flex items-center">
          <!-- Círculo del paso -->
          <div class="flex flex-col items-center">
            <div class="step-circle" :class="{
              'step-active': pasoActual === index,
              'step-done': pasoActual > index,
              'step-pending': pasoActual < index
            }">
              <i v-if="pasoActual > index" class="pi pi-check text-white text-sm"></i>
              <span v-else class="text-sm font-bold">{{ index + 1 }}</span>
            </div>
            <p class="step-label" :class="{ 'step-label-active': pasoActual >= index }">
              {{ step }}
            </p>
          </div>
          <!-- Línea entre pasos -->
          <div v-if="index < pasos.length - 1" class="step-line mb-5"
            :class="pasoActual > index ? 'step-line-done' : 'step-line-pending'"></div>
        </div>
      </div>

      <!-- ════════════════════════════════════════ -->
      <!-- PASO 1: CREAR CUENTA                    -->
      <!-- ════════════════════════════════════════ -->
      <div v-if="pasoActual === 0" class="bg-white rounded-2xl shadow-sm p-8">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Crea tu cuenta</h2>
          <p class="text-gray-500 mt-1">Primero configuramos tu acceso a la plataforma</p>
        </div>

        <div class="space-y-5">
          <!-- EMAIL -->
          <div class="field">
            <label class="field-label">Email *</label>
            <InputText v-model="usuarioData.email" type="email" placeholder="tu@email.com" class="w-full"
              :class="{ 'p-invalid': errores.email }" @blur="validarEmail" />
            <small v-if="errores.email" class="text-red-500">{{ errores.email }}</small>
          </div>

          <!-- PASSWORD -->
          <div class="field">
            <label class="field-label">Contraseña *</label>
            <Password v-model="usuarioData.password" toggleMask placeholder="Mínimo 8 caracteres" class="w-full"
              :class="{ 'p-invalid': errores.password }" weakLabel="Débil" mediumLabel="Moderada"
              strongLabel="Fuerte" />
            <small v-if="errores.password" class="text-red-500">{{ errores.password }}</small>
          </div>

          <!-- CONFIRMAR -->
          <div class="field">
            <label class="field-label">Confirmar contraseña *</label>
            <Password v-model="usuarioData.confirmPassword" toggleMask placeholder="Repite tu contraseña" class="w-full"
              :class="{ 'p-invalid': errores.confirmPassword }" :feedback="false" />
            <small v-if="errores.confirmPassword" class="text-red-500">{{ errores.confirmPassword }}</small>
          </div>

          <!-- ESTADO LABORAL -->
          <div class="field">
            <label class="field-label">Estado laboral actual *</label>
            <Select v-model="odontologoData.estado" :options="estadosLaborales" optionLabel="label" optionValue="value"
              placeholder="Selecciona tu situación" class="w-full" />
          </div>
        </div>

        <Button label="Continuar" icon="pi pi-arrow-right" iconPos="right" class="w-full mt-8 btn-primary"
          @click="irAPaso(1)" />
      </div>

      <!-- ════════════════════════════════════════ -->
      <!-- PASO 2: DATOS PROFESIONALES             -->
      <!-- ════════════════════════════════════════ -->
      <div v-if="pasoActual === 1" class="bg-white rounded-2xl shadow-sm p-8">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Datos profesionales</h2>
          <p class="text-gray-500 mt-1">Esta información será visible para las clínicas</p>
        </div>

        <div class="space-y-5">
          <!-- NOMBRE Y APELLIDO -->
          <div class="grid grid-cols-2 gap-4">
            <div class="field">
              <label class="field-label">Nombre *</label>
              <InputText v-model="odontologoData.nombre" placeholder="Juan" class="w-full"
                :class="{ 'p-invalid': errores.nombre }" />
              <small v-if="errores.nombre" class="text-red-500">{{ errores.nombre }}</small>
            </div>
            <div class="field">
              <label class="field-label">Apellido</label>
              <InputText v-model="odontologoData.apellido" placeholder="Pérez" class="w-full" />
            </div>
          </div>

          <!-- CÉDULA -->
          <div class="field">
            <label class="field-label">Cédula profesional *</label>
            <InputText v-model="odontologoData.cedula" placeholder="12345678-9" class="w-full"
              :class="{ 'p-invalid': errores.cedula }" />
            <small v-if="errores.cedula" class="text-red-500">{{ errores.cedula }}</small>
          </div>

          <!-- ESPECIALIDADES -->
          <div class="field">
            <label class="field-label">Especialidades</label>
            <MultiSelect v-model="especialidadesSeleccionadas" :options="especialidadesOpciones" optionLabel="label"
              optionValue="value" placeholder="Selecciona tus especialidades" class="w-full" display="chip" />
            <small class="text-gray-400">Puedes elegir más de una</small>
          </div>

          <!-- DESCRIPCIÓN -->
          <div class="field">
            <label class="field-label">Sobre mí</label>
            <Textarea v-model="odontologoData.descripcion"
              placeholder="Cuéntanos tu experiencia y áreas de especialización..." rows="4" class="w-full" />
            <small class="text-gray-400">{{ odontologoData.descripcion.length }}/1000 caracteres</small>
          </div>

          <!-- TELÉFONO Y UBICACIÓN -->
          <div class="grid grid-cols-2 gap-4">
            <div class="field">
              <label class="field-label">Teléfono *</label>
              <InputText v-model="odontologoData.telefono" placeholder="+1 234 567 8900" class="w-full"
                :class="{ 'p-invalid': errores.telefono }" />
              <small v-if="errores.telefono" class="text-red-500">{{ errores.telefono }}</small>
            </div>
            <div class="field">
              <label class="field-label">Ubicación *</label>
              <InputText v-model="odontologoData.ubicacion" placeholder="Ciudad, País" class="w-full"
                :class="{ 'p-invalid': errores.ubicacion }" />
              <small v-if="errores.ubicacion" class="text-red-500">{{ errores.ubicacion }}</small>
            </div>
          </div>
        </div>

        <div class="flex gap-3 mt-8">
          <Button label="Atrás" icon="pi pi-arrow-left" text class="w-full btn-back" @click="pasoActual = 0" />
          <Button label="Continuar" icon="pi pi-arrow-right" iconPos="right" class="w-full btn-primary"
            @click="irAPaso(2)" />
        </div>
      </div>

      <!-- ════════════════════════════════════════ -->
      <!-- PASO 3: DOCUMENTOS                      -->
      <!-- ════════════════════════════════════════ -->
      <div v-if="pasoActual === 2" class="bg-white rounded-2xl shadow-sm p-8">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Sube tus credenciales</h2>
          <p class="text-gray-500 mt-1">Las clínicas podrán revisar tus títulos y diplomas</p>
        </div>

        <!-- ZONA DRAG & DROP -->
        <div @dragover.prevent="dragover = true" @dragleave="dragover = false" @drop.prevent="handleDrop" :class="[
          'drop-zone',
          dragover ? 'drop-zone-active' : ''
        ]" @click="(fileInput as HTMLInputElement)?.click()">
          <input ref="fileInput" type="file" multiple accept=".pdf,.jpg,.jpeg,.png" class="hidden"
            @change="handleFileSelect" />
          <i class="pi pi-cloud-upload drop-icon"></i>
          <p class="font-semibold text-gray-700 mt-3">Arrastra archivos aquí o haz clic</p>
          <p class="text-sm text-gray-400 mt-1">PDF, JPG, PNG — máximo 5MB por archivo</p>
        </div>

        <!-- ARCHIVOS PENDIENTES DE SUBIR -->
        <div v-if="archivosParaSubir.length > 0" class="mt-6 space-y-3">
          <h3 class="font-semibold text-gray-900 flex items-center gap-2">
            <i class="pi pi-file text-gray-500"></i>
            Archivos a subir ({{ archivosParaSubir.length }})
          </h3>
          <div v-for="(item, index) in archivosParaSubir" :key="index" class="archivo-card">
            <div class="flex items-start gap-3">
              <i class="pi pi-file-pdf text-2xl mt-1" style="color: var(--color-primary)"></i>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-900 truncate">{{ item.archivo.name }}</p>
                <p class="text-xs text-gray-400">{{ (item.archivo.size / 1024).toFixed(0) }} KB</p>
                <Select v-model="item.tipo" :options="tiposDocumento" optionLabel="label" optionValue="value"
                  placeholder="Tipo de documento *" class="w-full mt-2" size="small" />
              </div>
              <Button icon="pi pi-times" text severity="danger" size="small" @click="eliminarArchivo(index)" />
            </div>
          </div>
        </div>

        <!-- DOCUMENTOS YA SUBIDOS -->
        <div v-if="documentosSubidos.length > 0" class="mt-6 space-y-3">
          <h3 class="font-semibold text-gray-900 flex items-center gap-2">
            <i class="pi pi-check-circle" style="color: #10b981"></i>
            Documentos subidos
          </h3>
          <div v-for="doc in documentosSubidos" :key="doc.id" class="archivo-card archivo-card-done">
            <div class="flex items-center gap-3">
              <i class="pi pi-file-pdf text-xl" style="color: #10b981"></i>
              <div class="flex-1">
                <p class="font-medium text-gray-900">{{ doc.nombreArchivo }}</p>
                <p class="text-xs text-gray-500">{{ doc.tipo }}</p>
              </div>
              <i class="pi pi-check-circle text-xl" style="color: #10b981"></i>
            </div>
          </div>
        </div>

        <!-- TIP -->
        <div class="tip-box mt-6">
          <i class="pi pi-info-circle tip-icon"></i>
          <p class="text-sm text-blue-800">
            <strong>Tip:</strong> Subir tu título, licencia y CV aumenta tus posibilidades de ser contratado por una
            clínica.
            Los documentos son opcionales pero recomendados.
          </p>
        </div>

        <!-- ERROR DOCUMENTOS -->
        <Message v-if="errorDocumentos" severity="error" :text="errorDocumentos" class="mt-4" />

        <!-- BOTONES -->
        <div class="flex gap-3 mt-8">
          <Button label="Atrás" icon="pi pi-arrow-left" text class="w-full btn-back" @click="pasoActual = 1" />
          <Button label="Completar registro" icon="pi pi-check" iconPos="right" class="w-full btn-primary"
            :loading="cargando" @click="registrarse" />
        </div>
      </div>

      <!-- PASO 4: ÉXITO -->
      <div v-if="pasoActual === 3" class="bg-white rounded-2xl shadow-sm p-8 text-center">
        <div class="success-icon mx-auto mb-6">
          <i class="pi pi-check text-white text-4xl"></i>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">¡Registro exitoso!</h2>
        <p class="text-gray-500 mb-8">Tu perfil ha sido creado. Las clínicas ya pueden encontrarte en Smillio.</p>
        <div class="space-y-3">
          <Button label="Ver mi perfil" icon="pi pi-user" class="w-full btn-primary"
            @click="router.push('/dashboard-odontologo')" />
          <Button label="Explorar clínicas" icon="pi pi-search" text class="w-full" style="color: var(--color-primary)"
            @click="router.push('/busqueda-clinicas')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Password from 'primevue/password'
import Select from 'primevue/select'
import MultiSelect from 'primevue/multiselect'
import Message from 'primevue/message'
import { useAuthStore } from '@/stores/authStore'
import { useOdontologoStore } from '@/stores/odontologoStore'
import { LanzarToast } from '@/utils/toastService'
import { registrarOdontologo } from '@/api/odontologos/odontologosApi'

const router = useRouter()
const authStore = useAuthStore()
const odontologoStore = useOdontologoStore()

const pasoActual = ref(0)
const pasos = ['Crear cuenta', 'Perfil profesional', 'Documentos']
const cargando = ref(false)
const dragover = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

// ─── Datos ────────────────────────────────────────
const usuarioData = ref({
  email: '',
  password: '',
  confirmPassword: ''
})

const odontologoData = ref({
  nombre: '',
  apellido: '',
  cedula: '',
  descripcion: '',
  telefono: '',
  ubicacion: '',
  estado: 'DESEMPLEADO'
})

const especialidadesSeleccionadas = ref<string[]>([])

// ─── Opciones ─────────────────────────────────────
const especialidadesOpciones = [
  { label: 'Implantes', value: 'IMPLANTES' },
  { label: 'Ortodoncia', value: 'ORTODONCIA' },
  { label: 'Endodoncia', value: 'ENDODONCIA' },
  { label: 'Periodoncia', value: 'PERIODONCIA' },
  { label: 'Cirugía Oral', value: 'CIRUGIA' },
  { label: 'Blanqueamiento', value: 'BLANQUEAMIENTO' },
  { label: 'Estética Dental', value: 'ESTETICA' },
  { label: 'Limpieza', value: 'LIMPIEZA' },
  { label: 'Odontología General', value: 'GENERAL' }
]

const tiposDocumento = [
  { label: 'Título de grado', value: 'TITULO' },
  { label: 'Diploma', value: 'DIPLOMA' },
  { label: 'Licencia profesional', value: 'LICENCIA' },
  { label: 'Curriculum Vitae (CV)', value: 'CV' },
  { label: 'Otro documento', value: 'OTRO' }
]

const estadosLaborales = [
  { label: 'Desempleado', value: 'DESEMPLEADO' },
  { label: 'Buscando empleo', value: 'BUSCA_EMPLEO' },
  { label: 'Actualmente empleado', value: 'EMPLEADO' }
]

// ─── Documentos ───────────────────────────────────
const archivosParaSubir = ref<{ archivo: File; tipo: string }[]>([])
const documentosSubidos = ref<any[]>([])
const errorDocumentos = ref('')

// ─── Validación ───────────────────────────────────
const errores = ref<Record<string, string>>({})

const validarEmail = () => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!usuarioData.value.email) {
    errores.value.email = 'El email es requerido'
  } else if (!re.test(usuarioData.value.email)) {
    errores.value.email = 'Formato de email inválido'
  } else {
    delete errores.value.email
  }
}

const validarPaso1 = (): boolean => {
  errores.value = {}
  validarEmail()
  if (!usuarioData.value.password) {
    errores.value.password = 'La contraseña es requerida'
  } else if (usuarioData.value.password.length < 8) {
    errores.value.password = 'Mínimo 8 caracteres'
  }
  if (usuarioData.value.password !== usuarioData.value.confirmPassword) {
    errores.value.confirmPassword = 'Las contraseñas no coinciden'
  }
  return Object.keys(errores.value).length === 0
}

const validarPaso2 = (): boolean => {
  errores.value = {}
  if (!odontologoData.value.nombre) errores.value.nombre = 'El nombre es requerido'
  if (!odontologoData.value.cedula) errores.value.cedula = 'La cédula profesional es requerida'
  if (!odontologoData.value.telefono) errores.value.telefono = 'El teléfono es requerido'
  if (!odontologoData.value.ubicacion) errores.value.ubicacion = 'La ubicación es requerida'
  return Object.keys(errores.value).length === 0
}

// Avanzar de paso con validación
const irAPaso = (destino: number) => {
  if (destino === 1 && !validarPaso1()) {
    LanzarToast('Completa todos los campos requeridos', 'warn')
    return
  }
  if (destino === 2 && !validarPaso2()) {
    LanzarToast('Completa todos los campos requeridos', 'warn')
    return
  }
  pasoActual.value = destino
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ─── Manejo de archivos ───────────────────────────
const handleDrop = (e: DragEvent) => {
  dragover.value = false
  const files = e.dataTransfer?.files
  if (files) procesarArchivos(Array.from(files))
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files) procesarArchivos(Array.from(target.files))
}

const procesarArchivos = (files: File[]) => {
  errorDocumentos.value = ''
  for (const file of files) {
    const tipo = file.type
    if (!['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'].includes(tipo)) {
      errorDocumentos.value = `"${file.name}" no es un formato permitido (PDF, JPG, PNG)`
      continue
    }
    if (file.size > 5 * 1024 * 1024) {
      errorDocumentos.value = `"${file.name}" supera el límite de 5MB`
      continue
    }
    archivosParaSubir.value.push({ archivo: file, tipo: '' })
  }
}

const eliminarArchivo = (index: number) => {
  archivosParaSubir.value.splice(index, 1)
}

// ─── Registro completo ────────────────────────────
const registrarse = async () => {
  // Validar que todos los archivos tienen tipo asignado
  const sinTipo = archivosParaSubir.value.some(a => !a.tipo)
  if (sinTipo) {
    LanzarToast('Selecciona el tipo de cada documento', 'warn')
    return
  }

  cargando.value = true
  try {
    // 1. Crear cuenta de usuario
    const usuarioRes = await registrarOdontologo({
      email: usuarioData.value.email,
      password: usuarioData.value.password,
      rol: 'ODONTOLOGO'
    })
    // 2. Crear perfil de odontólogo
    const odontologoRes = await odontologoStore.registrar({
      usuario: { id: usuarioRes.data.id },
      nombre: odontologoData.value.nombre,
      apellido: odontologoData.value.apellido,
      cedula: odontologoData.value.cedula,
      especialidades: especialidadesSeleccionadas.value.join(','),
      descripcion: odontologoData.value.descripcion,
      telefono: odontologoData.value.telefono,
      ubicacion: odontologoData.value.ubicacion,
      estado: odontologoData.value.estado
    })

    // 3. Subir documentos
    for (const item of archivosParaSubir.value) {
      try {
        const doc = await odontologoStore.subirDoc(odontologoRes.id, item.archivo, item.tipo)
        documentosSubidos.value.push(doc)
      } catch {
        console.error(`Error al subir: ${item.archivo.name}`)
      }
    }

    LanzarToast('¡Registro completado exitosamente!', 'success')
    pasoActual.value = 3 // Pantalla de éxito

  } catch (error: any) {
    const mensaje = error.response?.data?.error || 'Error al registrar. Intenta nuevamente.'
    LanzarToast(mensaje, 'error')
  } finally {
    cargando.value = false
  }
}

const irAtras = () => router.back()
</script>

<style scoped>
/* ── Steps ───────────────────────────────────────── */
.step-circle {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  transition: all 0.3s;
}

.step-active {
  background-color: var(--color-primary);
  color: white;
  box-shadow: 0 0 0 4px rgba(var(--color-primary-rgb, 79, 123, 203), 0.2);
}

.step-done {
  background-color: #10b981;
  color: white;
}

.step-pending {
  background-color: #e5e7eb;
  color: #9ca3af;
}

.step-label {
  font-size: 0.75rem;
  margin-top: 0.375rem;
  color: #9ca3af;
  text-align: center;
  max-width: 5rem;
}

.step-label-active {
  color: var(--color-primary);
  font-weight: 600;
}

.step-line {
  width: 5rem;
  height: 2px;
  margin-bottom: 1.25rem;
  transition: background-color 0.3s;
}

.step-line-done {
  background-color: #10b981;
}

.step-line-pending {
  background-color: #e5e7eb;
}

/* ── Campos ──────────────────────────────────────── */
.field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.field-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

/* ── Botones ─────────────────────────────────────── */
.btn-primary {
  background-color: var(--color-primary) !important;
  border: none !important;
  color: white !important;
  font-weight: 600 !important;
  padding: 0.75rem 1rem !important;
  border-radius: 0.75rem !important;
}

.btn-back {
  color: var(--color-primary) !important;
  font-weight: 600 !important;
}

/* ── Drag & Drop ─────────────────────────────────── */
.drop-zone {
  border: 2px dashed #d1d5db;
  border-radius: 1rem;
  padding: 2.5rem 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #f9fafb;
}

.drop-zone:hover,
.drop-zone-active {
  background-color: #eff6ff;
  border-color: var(--color-primary);
}

.drop-icon {
  font-size: 2.5rem;
  color: var(--color-primary);
}

/* ── Archivo card ────────────────────────────────── */
.archivo-card {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1rem;
}

.archivo-card-done {
  background-color: #ecfdf5;
  border-color: #a7f3d0;
}

/* ── Tip ─────────────────────────────────────────── */
.tip-box {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 0.75rem;
  padding: 1rem;
}

.tip-icon {
  color: #3b82f6;
  font-size: 1.1rem;
  margin-top: 0.1rem;
  flex-shrink: 0;
}

/* ── Éxito ───────────────────────────────────────── */
.success-icon {
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  background-color: #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
