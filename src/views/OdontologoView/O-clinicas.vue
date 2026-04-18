<template>
  <div class="odo-page">

    <nav class="odo-sidebar">
      <div class="odo-logo">
        <img src="@/assets/smilio-logo-blue.png" class="w-100" />
      </div>
      <div class="odo-nav">
        <Button @click="router.push('/o-home')" label="Home" icon="pi pi-home" text class="odo-btn" />
        <Button @click="router.push('/o-agenda')" label="Agenda" icon="pi pi-calendar" text class="odo-btn" />
        <Button @click="router.push('/o-pacientes')" label="Pacientes" icon="pi pi-users" text class="odo-btn" />
        <Button label="Clínicas" icon="pi pi-building" text class="odo-btn odo-btn-active" />
      </div>
      <div class="odo-nav-bottom">
        <Button @click="router.push('/o-perfil')" label="Mi Perfil" icon="pi pi-cog" text class="odo-btn" />
        <Button @click="cerrarSesion" label="Salir" icon="pi pi-sign-out" text class="odo-btn odo-btn-danger" />
      </div>
    </nav>

    <main class="odo-content">

      <div class="odo-topbar">
        <h1 class="odo-title">Mis Clínicas</h1>
      </div>

      <div v-if="loading" class="odo-loading">
        <ProgressSpinner />
      </div>

      <template v-else>

        <!-- Clínica actual -->
        <div v-if="miClinica">
          <p class="odo-section-label">Clínica actual</p>
          <div class="odo-clinica-card odo-clinica-current">
            <span class="odo-clinica-badge">Activo</span>
            <div class="odo-clinica-info">
              <h3 class="odo-clinica-nombre">{{ miClinica.nombre }}</h3>
              <p v-if="miClinica.direccion" class="odo-clinica-detail">
                <i class="pi pi-map-marker"></i> {{ miClinica.direccion }}
              </p>
              <p v-if="miClinica.telefono" class="odo-clinica-detail">
                <i class="pi pi-phone"></i> {{ miClinica.telefono }}
              </p>
              <p v-if="miClinica.email" class="odo-clinica-detail">
                <i class="pi pi-envelope"></i> {{ miClinica.email }}
              </p>
              <p v-if="miClinica.descripcion" class="odo-clinica-desc">{{ miClinica.descripcion }}</p>
            </div>
            <div class="odo-clinica-stats">
              <div class="odo-stat">
                <span class="odo-stat-val">{{ miClinica.rating?.toFixed(1) || '—' }}</span>
                <span class="odo-stat-lbl">Rating</span>
              </div>
              <div class="odo-stat">
                <span class="odo-stat-val">{{ miClinica.totalResenas || 0 }}</span>
                <span class="odo-stat-lbl">Reseñas</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Directorio -->
        <div>
          <div class="odo-dir-header">
            <p class="odo-section-label">Directorio de clínicas</p>
            <span style="font-size:13px;color:#94a3b8">{{ clinicasDisponibles.length }} clínicas registradas</span>
          </div>

          <div v-if="clinicasDisponibles.length === 0" class="odo-empty">
            <i class="pi pi-building" style="font-size:2.5rem;color:#94a3b8"></i>
            <p>No hay clínicas disponibles</p>
          </div>

          <div v-else class="odo-clinicas-list">
            <div v-for="c in clinicasDisponibles" :key="c.id" class="odo-clinica-card">
              <div class="odo-clinica-info">
                <h3 class="odo-clinica-nombre">{{ c.nombre }}</h3>
                <p v-if="c.direccion" class="odo-clinica-detail">
                  <i class="pi pi-map-marker"></i> {{ c.direccion }}
                </p>
                <p v-if="c.telefono" class="odo-clinica-detail">
                  <i class="pi pi-phone"></i> {{ c.telefono }}
                </p>
                <div v-if="c.servicios?.length" class="odo-servicios">
                  <Tag v-for="s in c.servicios.slice(0, 3)" :key="s.id" :value="s.nombre"
                    style="background:#f0f4ff;color:#16529e;font-size:11px" />
                </div>
              </div>
              <span v-if="c.rating" class="odo-rating">
                <i class="pi pi-star-fill" style="color:#f59e0b"></i>
                {{ c.rating.toFixed(1) }}
              </span>
            </div>
          </div>
        </div>

      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import ProgressSpinner from 'primevue/progressspinner'
import { useAuthStore } from '@/stores/authStore'
import { useOdontologoStore } from '@/stores/odontologoStore'
import { listarClinicas } from '@/api/clinicas/clinicasApi'

const router = useRouter()
const authStore = useAuthStore()
const odontologoStore = useOdontologoStore()

const loading = ref(true)
const clinicasDisponibles = ref<any[]>([])

const miClinica = computed(() => odontologoStore.miOdontologo?.clinicaActual || null)

const cerrarSesion = () => {
  authStore.logout()
  router.push('/')
}

onMounted(async () => {
  try {
    if (authStore.user?.id && !odontologoStore.miOdontologo) {
      await odontologoStore.cargarMiOdontologo(authStore.user.id)
    }
    const { data } = await listarClinicas()
    clinicasDisponibles.value = data || []
  } catch (e) {
    console.error('Error cargando clínicas', e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* ── Estructura ──────────────────────────────────── */
.odo-page {
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background: #f8fafc;
}

/* ── Sidebar ─────────────────────────────────────── */
.odo-sidebar {
  width: 240px;
  min-width: 240px;
  background: #16529e;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.odo-logo {
  padding: 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, .12);
  flex-shrink: 0;
}

.odo-logo img {
  height: 80px;
  object-fit: contain;
  display: block;
}

.odo-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0.75rem 0.5rem;
  flex: 1;
}

.odo-nav-bottom {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0.75rem 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, .1);
}

:deep(.odo-btn.p-button) {
  width: 100% !important;
  justify-content: flex-start !important;
  color: rgba(255, 255, 255, .8) !important;
  padding: 0.6rem 0.875rem !important;
  background: transparent !important;
  border: none !important;
  border-radius: 8px !important;
  font-size: 13.5px !important;
  font-weight: 500 !important;
  gap: 10px !important;
}

:deep(.odo-btn.p-button:hover) {
  background: rgba(255, 255, 255, .13) !important;
  color: #fff !important;
}

:deep(.odo-btn.p-button .p-button-icon) {
  color: inherit !important;
  font-size: 15px !important;
  margin-right: 0 !important;
}

:deep(.odo-btn-active.p-button) {
  background: rgba(255, 255, 255, .2) !important;
  color: #fff !important;
  font-weight: 600 !important;
}

:deep(.odo-btn-danger.p-button) {
  color: #fca5a5 !important;
}

/* ── Contenido ───────────────────────────────────── */
.odo-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.odo-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.odo-title {
  font-size: 1.375rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.odo-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.odo-section-label {
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: .06em;
  margin: 0 0 10px;
}

.odo-dir-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.odo-empty {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  color: #94a3b8;
}

.odo-clinicas-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* ── Tarjeta clínica ─────────────────────────────── */
.odo-clinica-card {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, .06);
  border: 1px solid #f1f5f9;
  transition: box-shadow .15s;
  position: relative;
}

.odo-clinica-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, .08);
}

.odo-clinica-current {
  border-left: 4px solid #16529e;
}

.odo-clinica-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #dcfce7;
  color: #15803d;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 9999px;
}

.odo-clinica-info {
  flex: 1;
}

.odo-clinica-nombre {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 6px;
}

.odo-clinica-detail {
  font-size: 13px;
  color: #64748b;
  margin: 4px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.odo-clinica-detail i {
  color: #16529e;
  font-size: 12px;
}

.odo-clinica-desc {
  font-size: 13px;
  color: #94a3b8;
  margin: 8px 0 0;
}

.odo-servicios {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.odo-clinica-stats {
  display: flex;
  gap: 1.5rem;
}

.odo-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.odo-stat-val {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.odo-stat-lbl {
  font-size: 10px;
  color: #94a3b8;
  text-transform: uppercase;
}

.odo-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  flex-shrink: 0;
}
</style>
