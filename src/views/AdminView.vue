<template>
  <div class="admin-layout">

    <!-- Topbar -->
    <div class="admin-topbar">
      <div class="flex items-center gap-3">
        <img src="/logo.png" alt="Smillio" class="h-8 w-8 object-contain" style="filter:brightness(0) invert(1)" />
        <span class="font-bold text-white text-lg tracking-wide">Smillio Admin</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-sm" style="color:rgba(255,255,255,.8)">{{ authStore.user?.correo }}</span>
        <button class="admin-logout" @click="cerrarSesion">
          <i class="pi pi-sign-out"></i> Salir
        </button>
      </div>
    </div>

    <div class="admin-body">

      <!-- Sidebar -->
      <nav class="admin-sidebar">
        <div class="admin-nav-section">Panel</div>
        <button
          v-for="item in menuItems"
          :key="item.id"
          :class="['admin-nav-item', { active: seccionActiva === item.id }]"
          @click="seccionActiva = item.id"
        >
          <i :class="['pi', item.icon]"></i>
          {{ item.label }}
        </button>
      </nav>

      <!-- Contenido -->
      <main class="admin-content">

        <!-- Resumen general -->
        <div v-if="seccionActiva === 'resumen'">
          <div class="admin-page-title">
            <i class="pi pi-chart-bar"></i> Resumen general
          </div>

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

          <div class="admin-info-box">
            <i class="pi pi-info-circle" style="font-size:20px;color:var(--color-primary)"></i>
            <div>
              <div class="font-medium text-gray-800">Panel de administración</div>
              <div class="text-sm text-gray-500 mt-1">
                Desde aquí puedes monitorear el estado general de la plataforma Smillio.
                Usa el menú lateral para navegar entre secciones.
              </div>
            </div>
          </div>
        </div>

        <!-- Clínicas -->
        <div v-else-if="seccionActiva === 'clinicas'">
          <div class="admin-page-title"><i class="pi pi-building"></i> Clínicas</div>
          <div v-if="loadingClinicas" class="admin-loading"><i class="pi pi-spin pi-spinner"></i></div>
          <div v-else class="admin-table-wrap">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>ID</th><th>Nombre</th><th>Doctor</th><th>Email</th><th>Teléfono</th><th>Rating</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="c in clinicas" :key="c.id">
                  <td class="text-xs text-gray-400">#{{ c.id }}</td>
                  <td class="font-medium">{{ c.nombre }}</td>
                  <td>{{ c.doctorNombre || '—' }}</td>
                  <td>{{ c.email || '—' }}</td>
                  <td>{{ c.telefono || '—' }}</td>
                  <td>
                    <span v-if="c.rating">
                      <span style="color:#f59e0b">★</span> {{ c.rating?.toFixed(1) }}
                    </span>
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

        <!-- Próximamente -->
        <div v-else class="admin-coming-soon">
          <i class="pi pi-wrench" style="font-size:40px;color:var(--neutral-300)"></i>
          <div class="text-lg font-medium text-gray-600 mt-3">Sección en construcción</div>
          <div class="text-sm text-gray-400 mt-1">Esta funcionalidad estará disponible pronto</div>
        </div>

      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { listarClinicas } from '@/api/clinicas/clinicasApi'
import { api } from '@/api/apiBase'

const router    = useRouter()
const authStore = useAuthStore()

const seccionActiva = ref('resumen')
const loading       = ref(false)
const loadingClinicas = ref(false)
const clinicas      = ref<any[]>([])

const stats = ref({ clinicas: 0, pacientes: 0, odontologos: 0, citas: 0 })

const menuItems = [
  { id: 'resumen',     icon: 'pi-chart-bar',  label: 'Resumen' },
  { id: 'clinicas',    icon: 'pi-building',   label: 'Clínicas' },
  { id: 'pacientes',   icon: 'pi-users',      label: 'Pacientes' },
  { id: 'odontologos', icon: 'pi-verified',   label: 'Odontólogos' },
  { id: 'citas',       icon: 'pi-calendar',   label: 'Citas' },
]

const cerrarSesion = () => {
  authStore.logout()
  router.push('/login')
}

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
  } catch {
    // silencioso
  } finally {
    loading.value = false
  }
})

// Cargar lista de clínicas cuando se selecciona esa sección
import { watch } from 'vue'
watch(seccionActiva, async (val) => {
  if (val === 'clinicas' && clinicas.value.length === 0) {
    loadingClinicas.value = true
    try {
      const res = await listarClinicas()
      clinicas.value = res.data || []
    } finally {
      loadingClinicas.value = false
    }
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
  height: 60px;
  background: #1e293b;
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

/* Body */
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

.admin-info-box {
  background: white; border-radius: 12px; padding: 1.25rem;
  display: flex; gap: 1rem; align-items: flex-start;
  border-left: 4px solid var(--color-primary);
  box-shadow: 0 1px 3px rgba(0,0,0,.06);
}

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
.admin-table td { padding: 12px 16px; border-bottom: 1px solid #f1f5f9; color: #374151; }
.admin-table tbody tr:hover { background: #f8fafc; }

.admin-coming-soon {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: 5rem;
  text-align: center;
}
</style>
