<template>
  <div class="admin-layout">

    <!-- Topbar -->
    <div class="admin-topbar">
      <div class="flex items-center gap-3">
        <button class="admin-hamburger" @click="sidebarOpen = !sidebarOpen">
          <i :class="sidebarOpen ? 'pi pi-times' : 'pi pi-bars'"></i>
        </button>
        <img src="/logo.png" alt="Smillio" class="h-8 w-8 object-contain" style="filter:brightness(0) invert(1)" />
        <span class="font-bold text-white text-lg tracking-wide">Smillio Admin</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="admin-email text-sm" style="color:rgba(255,255,255,.8)">{{ authStore.user?.correo }}</span>
        <button class="admin-logout" @click="cerrarSesion">
          <i class="pi pi-sign-out"></i> Salir
        </button>
      </div>
    </div>

    <div class="admin-body">
      <div v-if="sidebarOpen" class="admin-overlay" @click="sidebarOpen = false"></div>

      <!-- Sidebar -->
      <nav class="admin-sidebar" :class="{ 'sidebar-open': sidebarOpen }">
        <div class="admin-nav-section">Panel</div>
        <button v-for="item in menuItems" :key="item.id"
          :class="['admin-nav-item', { active: seccionActiva === item.id }]"
          @click="seccionActiva = item.id; sidebarOpen = false">
          <i :class="['pi', item.icon]"></i>
          {{ item.label }}
        </button>
      </nav>

      <!-- Contenido -->
      <main class="admin-content">

        <!-- ─── RESUMEN ─────────────────────────────── -->
        <div v-if="seccionActiva === 'resumen'">
          <div class="admin-page-title"><i class="pi pi-chart-bar"></i> Resumen general</div>
          <div v-if="loading" class="admin-loading">
            <i class="pi pi-spin pi-spinner" style="font-size:28px"></i>
            <span>Cargando datos...</span>
          </div>
          <div v-else class="admin-metrics">
            <div class="admin-metric-card">
              <div class="admin-metric-icon" style="background:#dbeafe;color:#1d4ed8">
                <i class="pi pi-building"></i>
              </div>
              <div>
                <div class="admin-metric-value">{{ stats.clinicas }}</div>
                <div class="admin-metric-label">Clínicas registradas</div>
              </div>
            </div>
            <div class="admin-metric-card">
              <div class="admin-metric-icon" style="background:#dcfce7;color:#15803d">
                <i class="pi pi-users"></i>
              </div>
              <div>
                <div class="admin-metric-value">{{ stats.pacientes }}</div>
                <div class="admin-metric-label">Pacientes registrados</div>
              </div>
            </div>
            <div class="admin-metric-card">
              <div class="admin-metric-icon" style="background:#ede9fe;color:#7c3aed">
                <i class="pi pi-verified"></i>
              </div>
              <div>
                <div class="admin-metric-value">{{ stats.odontologos }}</div>
                <div class="admin-metric-label">Odontólogos</div>
              </div>
            </div>
            <div class="admin-metric-card">
              <div class="admin-metric-icon" style="background:#fef3c7;color:#b45309">
                <i class="pi pi-calendar"></i>
              </div>
              <div>
                <div class="admin-metric-value">{{ stats.citas }}</div>
                <div class="admin-metric-label">Citas totales</div>
              </div>
            </div>
          </div>
        </div>

        <!-- ─── USUARIOS ────────────────────────────── -->
        <div v-else-if="seccionActiva === 'usuarios'">
          <div class="admin-page-title"><i class="pi pi-users"></i> Gestión de usuarios</div>
          <div v-if="loadingUsuarios" class="admin-loading"><i class="pi pi-spin pi-spinner"></i></div>
          <div v-else class="admin-table-wrap">
            <table class="admin-table">
              <thead>
                <tr><th>ID</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                <tr v-for="u in usuarios" :key="u.id">
                  <td class="text-xs text-gray-400">#{{ u.id }}</td>
                  <td class="font-medium">{{ u.correoElectronico }}</td>
                  <td><span class="role-badge">{{ u.rol }}</span></td>
                  <td>
                    <span :class="u.estaActivo ? 'status-active' : 'status-inactive'">
                      {{ u.estaActivo ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td class="flex gap-2">
                    <button v-if="!u.estaActivo" class="btn-table-action btn-activate"
                      @click="toggleUsuario(u, true)">Activar</button>
                    <button v-else class="btn-table-action btn-deactivate"
                      @click="toggleUsuario(u, false)">Desactivar</button>
                    <button class="btn-table-action btn-danger" @click="eliminarUsuario(u)">Eliminar</button>
                  </td>
                </tr>
                <tr v-if="!usuarios.length">
                  <td colspan="5" class="text-center text-gray-400 py-8">Sin usuarios</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ─── CLÍNICAS ────────────────────────────── -->
        <div v-else-if="seccionActiva === 'clinicas'">
          <div class="admin-page-title"><i class="pi pi-building"></i> Clínicas</div>
          <div v-if="loadingClinicas" class="admin-loading"><i class="pi pi-spin pi-spinner"></i></div>
          <div v-else class="admin-table-wrap">
            <table class="admin-table">
              <thead>
                <tr><th>ID</th><th>Nombre</th><th>Doctor</th><th>Email</th><th>Teléfono</th><th>Rating</th></tr>
              </thead>
              <tbody>
                <tr v-for="c in clinicas" :key="c.id">
                  <td class="text-xs text-gray-400">#{{ c.id }}</td>
                  <td class="font-medium">{{ c.nombre }}</td>
                  <td>{{ c.doctorNombre || '—' }}</td>
                  <td>{{ c.email || '—' }}</td>
                  <td>{{ c.telefono || '—' }}</td>
                  <td>
                    <span v-if="c.rating"><span style="color:#f59e0b">★</span> {{ c.rating?.toFixed(1) }}</span>
                    <span v-else class="text-xs text-gray-400">—</span>
                  </td>
                </tr>
                <tr v-if="!clinicas.length">
                  <td colspan="6" class="text-center text-gray-400 py-8">Sin clínicas registradas</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ─── CREAR CLÍNICA ──────────────────────── -->
        <div v-else-if="seccionActiva === 'crear-clinica'">
          <div class="admin-page-title"><i class="pi pi-plus-circle"></i> Crear cuenta de clínica</div>
          <div class="admin-form-card">
            <p class="text-sm text-gray-500 mb-6">
              Crea primero una cuenta de usuario con rol CLINICA desde la sección Usuarios, luego vincula aquí su perfil.
            </p>
            <div class="form-grid">
              <div class="form-field">
                <label>ID de usuario (Usuarios.id) *</label>
                <input v-model.number="nuevaClinica.usuarioId" type="number" placeholder="Ej: 12" class="form-input" />
              </div>
              <div class="form-field">
                <label>Nombre de la clínica *</label>
                <input v-model="nuevaClinica.nombre" placeholder="Clínica Dental XYZ" class="form-input" />
              </div>
              <div class="form-field">
                <label>RTN</label>
                <input v-model="nuevaClinica.rtn" placeholder="08011990123456" class="form-input" />
              </div>
              <div class="form-field">
                <label>Teléfono</label>
                <input v-model="nuevaClinica.telefono" placeholder="+504 2234-5678" class="form-input" />
              </div>
              <div class="form-field">
                <label>Email</label>
                <input v-model="nuevaClinica.email" type="email" placeholder="clinica@email.com" class="form-input" />
              </div>
              <div class="form-field">
                <label>Dirección</label>
                <input v-model="nuevaClinica.direccion" placeholder="Col. Las Minitas, Tegucigalpa" class="form-input" />
              </div>
              <div class="form-field col-span-2">
                <label>Descripción</label>
                <textarea v-model="nuevaClinica.descripcion" rows="3" class="form-input"
                  placeholder="Descripción de la clínica..."></textarea>
              </div>
            </div>
            <div class="flex gap-3 mt-6">
              <button class="btn-admin-primary" :disabled="creandoClinica" @click="crearClinicaAdmin">
                <i class="pi pi-save mr-2"></i>
                {{ creandoClinica ? 'Creando...' : 'Crear clínica' }}
              </button>
              <span v-if="mensajeClinica" :class="mensajeClinicaError ? 'text-red-500' : 'text-green-600'"
                class="text-sm self-center">{{ mensajeClinica }}</span>
            </div>
          </div>
        </div>

        <!-- ─── ESPECIALIDADES ─────────────────────── -->
        <div v-else-if="seccionActiva === 'especialidades'">
          <div class="admin-page-title"><i class="pi pi-tag"></i> Especialidades</div>

          <!-- Formulario nueva especialidad -->
          <div class="admin-form-card mb-6">
            <h3 class="font-semibold text-gray-800 mb-4">
              {{ editandoEspecialidad ? 'Editar especialidad' : 'Nueva especialidad' }}
            </h3>
            <div class="form-grid">
              <div class="form-field">
                <label>Nombre *</label>
                <input v-model="espForm.nombre" placeholder="Ortodoncia" class="form-input" />
              </div>
              <div class="form-field">
                <label>Ícono PrimeIcons (ej: pi-heart)</label>
                <input v-model="espForm.icono" placeholder="pi-heart" class="form-input" />
              </div>
              <div class="form-field col-span-2">
                <label>Descripción</label>
                <input v-model="espForm.descripcion" placeholder="Descripción breve..." class="form-input" />
              </div>
            </div>
            <div class="flex gap-3 mt-4">
              <button class="btn-admin-primary" @click="guardarEspecialidad">
                <i :class="`pi ${editandoEspecialidad ? 'pi-check' : 'pi-plus'} mr-2`"></i>
                {{ editandoEspecialidad ? 'Guardar cambios' : 'Crear especialidad' }}
              </button>
              <button v-if="editandoEspecialidad" class="btn-admin-secondary" @click="cancelarEdicionEsp">
                Cancelar
              </button>
            </div>
          </div>

          <!-- Tabla -->
          <div v-if="loadingEsp" class="admin-loading"><i class="pi pi-spin pi-spinner"></i></div>
          <div v-else class="admin-table-wrap">
            <table class="admin-table">
              <thead>
                <tr><th>ID</th><th>Nombre</th><th>Ícono</th><th>Descripción</th><th>Estado</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                <tr v-for="e in especialidades" :key="e.id">
                  <td class="text-xs text-gray-400">#{{ e.id }}</td>
                  <td class="font-medium">{{ e.nombre }}</td>
                  <td><i :class="`pi ${e.icono || 'pi-tag'}`" style="color:var(--color-primary)"></i></td>
                  <td class="text-sm text-gray-500">{{ e.descripcion || '—' }}</td>
                  <td>
                    <span :class="e.estaActiva ? 'status-active' : 'status-inactive'">
                      {{ e.estaActiva ? 'Activa' : 'Inactiva' }}
                    </span>
                  </td>
                  <td class="flex gap-2">
                    <button class="btn-table-action btn-activate" @click="editarEspecialidad(e)">Editar</button>
                    <button v-if="e.estaActiva" class="btn-table-action btn-deactivate"
                      @click="desactivarEsp(e.id)">Desactivar</button>
                  </td>
                </tr>
                <tr v-if="!especialidades.length">
                  <td colspan="6" class="text-center text-gray-400 py-8">Sin especialidades</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ─── RESEÑAS ─────────────────────────────── -->
        <div v-else-if="seccionActiva === 'resenas'">
          <div class="admin-page-title"><i class="pi pi-star"></i> Monitoreo de reseñas</div>
          <div v-if="loadingResenas" class="admin-loading"><i class="pi pi-spin pi-spinner"></i></div>
          <div v-else class="admin-table-wrap">
            <table class="admin-table">
              <thead>
                <tr><th>ID</th><th>Clínica</th><th>Rating</th><th>Comentario</th><th>Fecha</th><th>Respondida</th></tr>
              </thead>
              <tbody>
                <tr v-for="r in resenas" :key="r.id">
                  <td class="text-xs text-gray-400">#{{ r.id }}</td>
                  <td class="font-medium">{{ r.clinica?.nombre || `Clínica #${r.clinicaId}` }}</td>
                  <td>
                    <span style="color:#f59e0b">{{ '★'.repeat(r.rating) }}</span>
                    <span style="color:#d1d5db">{{ '★'.repeat(5 - r.rating) }}</span>
                  </td>
                  <td class="text-sm text-gray-600" style="max-width:200px;overflow:hidden;text-overflow:ellipsis">
                    {{ r.texto || '—' }}
                  </td>
                  <td class="text-xs text-gray-400">{{ r.fecha }}</td>
                  <td>
                    <span :class="r.respondida ? 'status-active' : 'status-inactive'">
                      {{ r.respondida ? 'Sí' : 'Pendiente' }}
                    </span>
                  </td>
                </tr>
                <tr v-if="!resenas.length">
                  <td colspan="6" class="text-center text-gray-400 py-8">Sin reseñas registradas</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ─── INGRESOS ────────────────────────────── -->
        <div v-else-if="seccionActiva === 'ingresos'">
          <div class="admin-page-title"><i class="pi pi-dollar"></i> Ingresos mensuales</div>

          <div class="flex items-center gap-4 mb-6">
            <div class="form-field" style="min-width:120px">
              <label>Año</label>
              <input v-model.number="ingresosFiltro.year" type="number" :min="2020" :max="2030"
                class="form-input" @change="cargarIngresos" />
            </div>
          </div>

          <div v-if="loadingIngresos" class="admin-loading"><i class="pi pi-spin pi-spinner"></i></div>
          <div v-else>
            <!-- Tabla mensual -->
            <div class="admin-table-wrap mb-6">
              <table class="admin-table">
                <thead>
                  <tr><th>Mes</th><th>Ingresos (L)</th></tr>
                </thead>
                <tbody>
                  <tr v-for="row in ingresosMensuales" :key="row.mes">
                    <td class="font-medium">{{ nombreMes(row.mes) }}</td>
                    <td>L {{ row.total.toLocaleString('es-HN', { minimumFractionDigits: 2 }) }}</td>
                  </tr>
                  <tr class="font-bold bg-gray-50">
                    <td>Total anual</td>
                    <td>L {{ totalAnual.toLocaleString('es-HN', { minimumFractionDigits: 2 }) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Tabla por clínica -->
            <div class="admin-page-title" style="font-size:15px"><i class="pi pi-building"></i> Por clínica</div>
            <div class="admin-table-wrap">
              <table class="admin-table">
                <thead>
                  <tr><th>Clínica</th><th>Ingresos (L)</th></tr>
                </thead>
                <tbody>
                  <tr v-for="row in ingresosPorClinica" :key="row.clinicaId">
                    <td class="font-medium">{{ row.clinicaNombre }}</td>
                    <td>L {{ row.total.toLocaleString('es-HN', { minimumFractionDigits: 2 }) }}</td>
                  </tr>
                  <tr v-if="!ingresosPorClinica.length">
                    <td colspan="2" class="text-center text-gray-400 py-6">Sin datos</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ─── FALLBACK ────────────────────────────── -->
        <div v-else class="admin-coming-soon">
          <i class="pi pi-wrench" style="font-size:40px;color:var(--neutral-300)"></i>
          <div class="text-lg font-medium text-gray-600 mt-3">Sección en construcción</div>
        </div>

      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { listarClinicas, crearClinica } from '@/api/clinicas/clinicasApi'
import {
  listarTodasEspecialidades,
  crearEspecialidad,
  actualizarEspecialidad,
  eliminarEspecialidad
} from '@/api/especialidades/especialidadesApi'
import { api } from '@/api/apiBase'
import { LanzarToast } from '@/utils/toastService'

const router    = useRouter()
const authStore = useAuthStore()

const sidebarOpen     = ref(false)
const seccionActiva   = ref('resumen')
const loading         = ref(false)
const loadingClinicas = ref(false)
const loadingUsuarios = ref(false)
const loadingEsp      = ref(false)
const loadingResenas  = ref(false)
const loadingIngresos = ref(false)

const clinicas    = ref<any[]>([])
const usuarios    = ref<any[]>([])
const especialidades = ref<any[]>([])
const resenas     = ref<any[]>([])
const ingresosMensuales  = ref<any[]>([])
const ingresosPorClinica = ref<any[]>([])
const stats = ref({ clinicas: 0, pacientes: 0, odontologos: 0, citas: 0 })

const menuItems = [
  { id: 'resumen',       icon: 'pi-chart-bar',    label: 'Resumen' },
  { id: 'usuarios',      icon: 'pi-users',         label: 'Usuarios' },
  { id: 'clinicas',      icon: 'pi-building',      label: 'Clínicas' },
  { id: 'crear-clinica', icon: 'pi-plus-circle',   label: 'Nueva clínica' },
  { id: 'especialidades',icon: 'pi-tag',            label: 'Especialidades' },
  { id: 'resenas',       icon: 'pi-star',           label: 'Reseñas' },
  { id: 'ingresos',      icon: 'pi-dollar',         label: 'Ingresos' },
]

const cerrarSesion = () => {
  authStore.logout()
  router.push('/login')
}

// ── Usuarios ──────────────────────────────────────
const cargarUsuarios = async () => {
  loadingUsuarios.value = true
  try {
    const { data } = await api.get('/admin/usuarios')
    usuarios.value = data
  } catch { LanzarToast('Error al cargar usuarios', 'error') }
  finally { loadingUsuarios.value = false }
}

const toggleUsuario = async (u: any, activo: boolean) => {
  try {
    await api.put(`/admin/usuarios/${u.id}/${activo ? 'activar' : 'desactivar'}`)
    u.estaActivo = activo
    LanzarToast(`Usuario ${activo ? 'activado' : 'desactivado'}`, 'success')
  } catch { LanzarToast('Error al actualizar usuario', 'error') }
}

const eliminarUsuario = async (u: any) => {
  if (!confirm(`¿Eliminar usuario ${u.correoElectronico}?`)) return
  try {
    await api.delete(`/admin/usuarios/${u.id}`)
    usuarios.value = usuarios.value.filter(x => x.id !== u.id)
    LanzarToast('Usuario eliminado', 'success')
  } catch { LanzarToast('Error al eliminar usuario', 'error') }
}

// ── Crear clínica ─────────────────────────────────
const nuevaClinica = ref({ usuarioId: null as number | null, nombre: '', rtn: '', telefono: '', email: '', direccion: '', descripcion: '' })
const creandoClinica   = ref(false)
const mensajeClinica   = ref('')
const mensajeClinicaError = ref(false)

const crearClinicaAdmin = async () => {
  if (!nuevaClinica.value.usuarioId || !nuevaClinica.value.nombre) {
    mensajeClinica.value = 'Usuario ID y nombre son requeridos'
    mensajeClinicaError.value = true
    return
  }
  creandoClinica.value = true
  mensajeClinica.value = ''
  try {
    await crearClinica(nuevaClinica.value as any)
    mensajeClinica.value = '¡Clínica creada exitosamente!'
    mensajeClinicaError.value = false
    nuevaClinica.value = { usuarioId: null, nombre: '', rtn: '', telefono: '', email: '', direccion: '', descripcion: '' }
    LanzarToast('Clínica creada', 'success')
  } catch (e: any) {
    mensajeClinica.value = e.response?.data || 'Error al crear clínica'
    mensajeClinicaError.value = true
  } finally {
    creandoClinica.value = false
  }
}

// ── Especialidades ────────────────────────────────
const espForm = ref({ nombre: '', icono: '', descripcion: '' })
const editandoEspecialidad = ref<any>(null)

const cargarEspecialidades = async () => {
  loadingEsp.value = true
  try {
    const { data } = await listarTodasEspecialidades()
    especialidades.value = data
  } catch { LanzarToast('Error al cargar especialidades', 'error') }
  finally { loadingEsp.value = false }
}

const editarEspecialidad = (e: any) => {
  editandoEspecialidad.value = e
  espForm.value = { nombre: e.nombre, icono: e.icono || '', descripcion: e.descripcion || '' }
}

const cancelarEdicionEsp = () => {
  editandoEspecialidad.value = null
  espForm.value = { nombre: '', icono: '', descripcion: '' }
}

const guardarEspecialidad = async () => {
  if (!espForm.value.nombre) { LanzarToast('El nombre es requerido', 'warn'); return }
  try {
    if (editandoEspecialidad.value) {
      const { data } = await actualizarEspecialidad(editandoEspecialidad.value.id, espForm.value)
      const idx = especialidades.value.findIndex(e => e.id === editandoEspecialidad.value.id)
      if (idx !== -1) especialidades.value[idx] = data
      LanzarToast('Especialidad actualizada', 'success')
    } else {
      const { data } = await crearEspecialidad(espForm.value)
      especialidades.value.push(data)
      LanzarToast('Especialidad creada', 'success')
    }
    cancelarEdicionEsp()
  } catch (e: any) {
    LanzarToast(e.response?.data || 'Error al guardar', 'error')
  }
}

const desactivarEsp = async (id: number) => {
  try {
    await eliminarEspecialidad(id)
    const esp = especialidades.value.find(e => e.id === id)
    if (esp) esp.estaActiva = false
    LanzarToast('Especialidad desactivada', 'success')
  } catch { LanzarToast('Error al desactivar', 'error') }
}

// ── Reseñas ───────────────────────────────────────
const cargarResenas = async () => {
  loadingResenas.value = true
  try {
    const { data } = await api.get('/admin/resenas')
    resenas.value = data
  } catch { LanzarToast('Error al cargar reseñas', 'error') }
  finally { loadingResenas.value = false }
}

// ── Ingresos ──────────────────────────────────────
const ingresosFiltro = ref({ year: new Date().getFullYear() })
const totalAnual = computed(() => ingresosMensuales.value.reduce((acc, r) => acc + r.total, 0))

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const nombreMes = (m: number) => MESES[m - 1] || m

const cargarIngresos = async () => {
  loadingIngresos.value = true
  try {
    const [mensualRes, clinicaRes] = await Promise.all([
      api.get('/admin/ingresos/mensuales', { params: { year: ingresosFiltro.value.year } }),
      api.get('/admin/ingresos/clinicas',  { params: { year: ingresosFiltro.value.year } }),
    ])
    ingresosMensuales.value  = mensualRes.data
    ingresosPorClinica.value = clinicaRes.data
  } catch { LanzarToast('Error al cargar ingresos', 'error') }
  finally { loadingIngresos.value = false }
}

// ── Watch para cargar datos al cambiar sección ────
watch(seccionActiva, async (val) => {
  if (val === 'usuarios' && !usuarios.value.length) await cargarUsuarios()
  if (val === 'clinicas' && !clinicas.value.length) {
    loadingClinicas.value = true
    try { clinicas.value = (await listarClinicas()).data || [] }
    finally { loadingClinicas.value = false }
  }
  if (val === 'especialidades' && !especialidades.value.length) await cargarEspecialidades()
  if (val === 'resenas' && !resenas.value.length) await cargarResenas()
  if (val === 'ingresos' && !ingresosMensuales.value.length) await cargarIngresos()
})

onMounted(async () => {
  loading.value = true
  try {
    const [clinicasRes, pacientesRes] = await Promise.allSettled([
      listarClinicas(),
      api.get('/pacientes'),
    ])
    if (clinicasRes.status === 'fulfilled') {
      clinicas.value = clinicasRes.value.data || []
      stats.value.clinicas = clinicas.value.length
    }
    if (pacientesRes.status === 'fulfilled') {
      stats.value.pacientes = pacientesRes.value.data?.length || 0
    }
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.admin-layout {
  display: flex; flex-direction: column; height: 100vh; overflow: hidden;
  background: #f1f5f9;
}

/* Topbar */
.admin-topbar {
  height: 60px; background: #1e293b;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 1.5rem; flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,.2);
}
.admin-logout {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 14px; border-radius: 8px;
  background: rgba(255,255,255,.1); color: rgba(255,255,255,.85);
  border: 1px solid rgba(255,255,255,.15); font-size: 13px; cursor: pointer;
  transition: background .15s;
}
.admin-logout:hover { background: rgba(255,255,255,.2); }

.admin-body { display: flex; flex: 1; overflow: hidden; }

/* Sidebar */
.admin-sidebar {
  width: 220px; background: #0f172a; flex-shrink: 0;
  display: flex; flex-direction: column; padding: 1.25rem 0.75rem;
  gap: 4px; overflow-y: auto;
}
.admin-nav-section {
  font-size: 10px; font-weight: 600; color: #64748b;
  text-transform: uppercase; letter-spacing: .08em;
  padding: 0 8px; margin-bottom: 6px;
}
.admin-nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 12px; border-radius: 8px;
  font-size: 13px; font-weight: 500; color: #94a3b8;
  background: transparent; border: none; cursor: pointer;
  text-align: left; transition: all .15s; width: 100%;
}
.admin-nav-item i { font-size: 15px; }
.admin-nav-item:hover { background: rgba(255,255,255,.06); color: #e2e8f0; }
.admin-nav-item.active { background: rgba(79,123,203,.25); color: #93c5fd; }

/* Hamburger */
.admin-hamburger {
  display: none;
  background: transparent; border: none; color: white;
  font-size: 1.1rem; padding: 6px; cursor: pointer;
}

/* Overlay */
.admin-overlay {
  display: none;
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5); z-index: 15;
}

@media (max-width: 768px) {
  .admin-hamburger { display: flex; align-items: center; }
  .admin-email { display: none; }

  .admin-overlay { display: block; }

  .admin-sidebar {
    position: fixed;
    top: 56px; left: 0; bottom: 0;
    z-index: 20;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    box-shadow: 4px 0 16px rgba(0,0,0,0.3);
  }
  .admin-sidebar.sidebar-open { transform: translateX(0); }

  .admin-content { padding: 0.75rem; }

  .form-grid { grid-template-columns: 1fr !important; }
}

/* Content */
.admin-content { flex: 1; overflow-y: auto; padding: 1.5rem; }

.admin-page-title {
  font-size: 18px; font-weight: 700; color: #1e293b;
  margin-bottom: 1.25rem; display: flex; align-items: center; gap: 8px;
}
.admin-page-title i { color: var(--color-primary); }

.admin-loading {
  display: flex; align-items: center; gap: 10px;
  padding: 3rem; color: #94a3b8; font-size: 14px;
}

/* Metrics */
.admin-metrics {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 1rem; margin-bottom: 1.5rem;
}
@media (max-width: 900px) { .admin-metrics { grid-template-columns: repeat(2, 1fr); } }
.admin-metric-card {
  background: white; border-radius: 12px; padding: 1.25rem;
  display: flex; align-items: center; gap: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,.06);
}
.admin-metric-icon {
  width: 48px; height: 48px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; flex-shrink: 0;
}
.admin-metric-value { font-size: 24px; font-weight: 700; color: #1e293b; }
.admin-metric-label { font-size: 12px; color: #94a3b8; margin-top: 2px; }

/* Table */
.admin-table-wrap {
  background: white; border-radius: 12px; overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,.06);
}
.admin-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.admin-table th {
  background: #f8fafc; padding: 12px 16px; text-align: left;
  font-size: 11px; color: #64748b; font-weight: 600;
  text-transform: uppercase; letter-spacing: .05em;
  border-bottom: 1px solid #e2e8f0;
}
.admin-table td {
  padding: 12px 16px; border-bottom: 1px solid #f1f5f9; color: #374151;
  vertical-align: middle;
}
.admin-table tbody tr:hover { background: #f8fafc; }

/* Status badges */
.status-active {
  display: inline-block; padding: 2px 8px; border-radius: 9999px;
  font-size: 11px; font-weight: 600;
  background: #dcfce7; color: #15803d;
}
.status-inactive {
  display: inline-block; padding: 2px 8px; border-radius: 9999px;
  font-size: 11px; font-weight: 600;
  background: #fee2e2; color: #b91c1c;
}
.role-badge {
  display: inline-block; padding: 2px 8px; border-radius: 9999px;
  font-size: 11px; font-weight: 600;
  background: #ede9fe; color: #6d28d9;
}

/* Table action buttons */
.btn-table-action {
  padding: 3px 10px; border-radius: 6px; font-size: 12px;
  font-weight: 500; border: none; cursor: pointer; transition: opacity .15s;
}
.btn-activate  { background: #dcfce7; color: #15803d; }
.btn-deactivate { background: #fef3c7; color: #92400e; }
.btn-danger    { background: #fee2e2; color: #b91c1c; }
.btn-table-action:hover { opacity: .8; }

/* Forms */
.admin-form-card {
  background: white; border-radius: 12px; padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,.06);
}
.form-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
}
.form-field { display: flex; flex-direction: column; gap: 4px; }
.form-field label { font-size: 12px; font-weight: 600; color: #374151; }
.form-input {
  padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px;
  font-size: 13px; outline: none; transition: border-color .15s;
}
.form-input:focus { border-color: var(--color-primary); }
.col-span-2 { grid-column: span 2; }

.btn-admin-primary {
  padding: 9px 20px; background: var(--color-primary); color: white;
  border: none; border-radius: 8px; font-size: 13px; font-weight: 600;
  cursor: pointer; display: flex; align-items: center;
  transition: opacity .15s;
}
.btn-admin-primary:hover:not(:disabled) { opacity: .85; }
.btn-admin-primary:disabled { opacity: .5; cursor: not-allowed; }
.btn-admin-secondary {
  padding: 9px 20px; background: #f1f5f9; color: #374151;
  border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; font-weight: 600;
  cursor: pointer;
}
.btn-admin-secondary:hover { background: #e2e8f0; }

.admin-coming-soon {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: 5rem; text-align: center;
}
</style>
